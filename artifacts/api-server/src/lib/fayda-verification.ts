import { createHash, randomBytes } from "crypto";

export interface FaydaVerificationResponse {
  verified: boolean;
  id: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  status?: string;
  authUrl?: string;
  state?: string;
  codeVerifier?: string;
  claims?: Record<string, unknown>;
  error?: string;
}

type FaydaConfig = {
  clientId: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint: string;
  mockEnabled: boolean;
};

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  [key: string]: unknown;
};

export class FaydaVerificationService {
  private config: FaydaConfig;

  constructor(config: Partial<FaydaConfig> = {}) {
    this.config = {
      clientId: config.clientId ?? process.env.FAYDA_CLIENT_ID ?? "",
      redirectUri: config.redirectUri ?? process.env.FAYDA_REDIRECT_URI ?? "",
      authorizationEndpoint: config.authorizationEndpoint ?? process.env.FAYDA_AUTHORIZATION_ENDPOINT ?? "",
      tokenEndpoint: config.tokenEndpoint ?? process.env.FAYDA_TOKEN_ENDPOINT ?? "",
      userInfoEndpoint: config.userInfoEndpoint ?? process.env.FAYDA_USERINFO_ENDPOINT ?? "",
      mockEnabled: config.mockEnabled ?? process.env.FAYDA_MOCK_ENABLED !== "false",
    };
  }

  /**
   * Build the Fayda eSignet OIDC authorization URL using the same
   * Authorization Code + PKCE pattern exposed by fayda-auth-sdk.
   */
  createAuthorizationRequest(faydaId?: string) {
    if (!this.isConfigured()) {
      return null;
    }

    const state = randomBytes(16).toString("hex");
    const codeVerifier = randomBytes(32).toString("base64url");
    const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
    const url = new URL(this.config.authorizationEndpoint);

    url.searchParams.set("client_id", this.config.clientId);
    url.searchParams.set("redirect_uri", this.config.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid profile");
    url.searchParams.set("state", state);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");
    if (faydaId) url.searchParams.set("login_hint", faydaId);

    return {
      authUrl: url.toString(),
      state,
      codeVerifier,
    };
  }

  async verifyFaydaId(
    faydaId: string,
    options: { code?: string; codeVerifier?: string } = {},
  ): Promise<FaydaVerificationResponse> {
    if (this.config.mockEnabled || !this.isConfigured()) {
      return this.mockVerification(faydaId);
    }

    if (!options.code || !options.codeVerifier) {
      const auth = this.createAuthorizationRequest(faydaId);
      return {
        verified: false,
        id: faydaId,
        status: "AUTHORIZATION_REQUIRED",
        authUrl: auth?.authUrl,
        state: auth?.state,
        codeVerifier: auth?.codeVerifier,
      };
    }

    try {
      const tokens = await this.exchangeCodeForTokens(options.code, options.codeVerifier);
      const claims = tokens.id_token ? this.decodeJwtPayload(tokens.id_token) : {};
      const userInfo = tokens.access_token ? await this.getUserInfo(tokens.access_token) : {};
      const mergedClaims = { ...claims, ...userInfo };
      const claimId = this.getClaimString(mergedClaims, ["uin", "sub", "faydaId", "fayda_id", "national_id"]);
      const verified = Boolean(claimId && claimId === faydaId);

      return {
        verified,
        id: faydaId,
        name: this.getLocalizedClaim(mergedClaims.fullName) ?? this.getClaimString(mergedClaims, ["name", "full_name"]),
        birthDate: this.getClaimString(mergedClaims, ["dateOfBirth", "birthdate", "date_of_birth"]),
        gender: this.getLocalizedClaim(mergedClaims.gender) ?? this.getClaimString(mergedClaims, ["gender"]),
        status: verified ? "VERIFIED" : "MISMATCH",
        claims: mergedClaims,
        error: verified ? undefined : "Fayda user did not match the entered ID",
      };
    } catch (error) {
      console.error("Fayda verification failed:", error);
      return {
        verified: false,
        id: faydaId,
        error: "Verification service error",
      };
    }
  }

  private isConfigured() {
    return Boolean(
      this.config.clientId &&
        this.config.redirectUri &&
        this.config.authorizationEndpoint &&
        this.config.tokenEndpoint &&
        this.config.userInfoEndpoint,
    );
  }

  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(this.config.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Fayda token exchange failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<TokenResponse>;
  }

  private async getUserInfo(accessToken: string): Promise<Record<string, unknown>> {
    const response = await fetch(this.config.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fayda userinfo failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<Record<string, unknown>>;
  }

  private decodeJwtPayload(token: string): Record<string, unknown> {
    const [, payload] = token.split(".");
    if (!payload) return {};

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<string, unknown>;
  }

  private getClaimString(claims: Record<string, unknown>, keys: string[]) {
    for (const key of keys) {
      const value = claims[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return undefined;
  }

  private getLocalizedClaim(value: unknown) {
    if (!Array.isArray(value)) return undefined;
    const english = value.find((item) => item?.language === "eng" && typeof item.value === "string");
    const first = value.find((item) => typeof item?.value === "string");
    return english?.value ?? first?.value;
  }

  private mockVerification(faydaId: string): FaydaVerificationResponse {
    const mockId = process.env.FAYDA_MOCK_ID || "1234567890123456";
    const isValid = faydaId === mockId || /^\d{5,}$/.test(faydaId);

    return {
      verified: isValid,
      id: faydaId,
      name: isValid ? process.env.FAYDA_MOCK_FULL_NAME || "Mock Fayda User" : undefined,
      birthDate: isValid ? process.env.FAYDA_MOCK_BIRTH_DATE || "1998/01/01" : undefined,
      gender: isValid ? process.env.FAYDA_MOCK_GENDER || "Male" : undefined,
      status: isValid ? "VERIFIED" : "INVALID",
      error: isValid ? undefined : "Invalid Fayda ID format",
    };
  }

  /**
   * Batch verify multiple Fayda IDs
   */
  async verifyMultipleFaydaIds(faydaIds: string[]): Promise<Map<string, FaydaVerificationResponse>> {
    const results = new Map<string, FaydaVerificationResponse>();
    
    for (const id of faydaIds) {
      const result = await this.verifyFaydaId(id);
      results.set(id, result);
    }
    
    return results;
  }
}

/**
 * Initialize Fayda verification service
 */
export function initializeFaydaVerificationService(): FaydaVerificationService {
  return new FaydaVerificationService();
}

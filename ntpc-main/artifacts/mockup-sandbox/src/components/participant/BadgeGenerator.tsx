import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { participantService } from "@/lib/participant-service";

interface BadgeGeneratorProps {
  onGenerateBadge: (participantId: number) => Promise<void>;
}

export function BadgeGenerator({ onGenerateBadge }: BadgeGeneratorProps) {
  const [participantId, setParticipantId] = React.useState<number | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isLookupComplete, setIsLookupComplete] = React.useState(false);
  const [participantData, setParticipantData] = React.useState<any>(null);

  const handleLookupParticipant = async () => {
    if (!participantId) return;
    
    try {
      // In a real app, this would call an API to fetch participant data
      // For now, we'll use the participant service to get data
      // Since we don't have a direct lookup endpoint, we'll simulate with mock data
      setIsLookupComplete(false);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock participant data based on ID
      const mockData = {
        id: participantId,
        firstName: "John",
        lastName: "Doe",
        faydaId: `FYDA${participantId.toString().padStart(9, '0')}`,
        registrationNumber: `EY${Date.now()}${participantId.toString().padStart(4, '0')}`,
        event: { title: "National Youth Conference 2026" },
        round: { roundNumber: 1 }
      };
      
      setParticipantData(mockData);
      setIsLookupComplete(true);
    } catch (error) {
      toast({
        title: "Error looking up participant",
        description: "Please check the participant ID and try again.",
        variant: "destructive",
      });
      setIsLookupComplete(false);
    }
  };

  const handleGenerateBadge = async () => {
    if (!participantId) {
      toast({
        title: "Please enter a Participant ID",
        description: "Enter a valid participant ID to generate a badge",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateBadge(participantId);
      toast({
        title: "Badge generated successfully!",
        description: "Your badge is ready to print.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate badge",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Participant Badge</CardTitle>
          <CardDescription>
            Enter participant ID to generate a printable event badge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participant ID
              </label>
              <Input
                type="number"
                value={participantId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setParticipantId(value === "" ? null : parseInt(value));
                  // Reset participant data when ID changes
                  if (value === "") {
                    setParticipantData(null);
                    setIsLookupComplete(false);
                  }
                }}
                placeholder="Enter participant ID"
                required
                min="1"
              />
            </div>
            
            {!isLookupComplete && participantId && participantId > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Looking up participant...</span>
              </div>
            )}
            
            {isLookupComplete && participantData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Participant Information:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Name:</span>
                    <span className="text-gray-800">{participantData.firstName} {participantData.lastName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Fayda ID:</span>
                    <span className="text-gray-800 font-mono">{participantData.faydaId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Reg #:</span>
                    <span className="text-gray-800 font-mono">{participantData.registrationNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Event:</span>
                    <span className="text-gray-800">{participantData.event.title}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Round:</span>
                    <span className="text-gray-800">{participantData.round.roundNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-start">
          <div className="flex-1 space-x-3">
            <Button
              variant="outline"
              onClick={handleLookupParticipant}
              disabled={!participantId || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Processing..." : "Lookup Participant"}
            </Button>
            
            <Button
              variant="default"
              onClick={handleGenerateBadge}
              disabled={!isLookupComplete || !participantData || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Badge"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLookupComplete && participantData ? (
            <div className="relative h-[5.5in] w-[4in] bg-gradient-to-br from-[#2c3e50] to-[#4a6fa5] rounded-xl p-6 text-white shadow-lg overflow-hidden">
              {/* Security watermark */}
              <div className="absolute inset-0 flex items-center justify-center text-[80px] font-bold text-white/5 -rotate-12 select-none pointer-events-none">
                NTPC
              </div>
              
              {/* Header accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f39c12] via-[#e67e22] to-[#f1c40f]"></div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="border-b border-white/20 pb-4 mb-4">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                      ⛪
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white/90">NTPC Church</div>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-white/90">NTPC Event Badge</h2>
                  <p className="text-lg font-medium text-[#fdcb6e] bg-white/10 px-3 py-1 rounded-full inline-block">
                    {participantData.event.title}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                  <div className="text-2xl font-bold text-white/95 tracking-wider">
                    {participantData.firstName} {participantData.lastName}
                  </div>
                  
                  <div className="space-y-2 w-full text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Fayda ID:</span>
                      <span className="text-white/90 font-mono">{participantData.faydaId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Reg #:</span>
                      <span className="text-white/90 font-mono">{participantData.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Round:</span>
                      <span className="text-white/90 font-mono">{participantData.round.roundNumber}</span>
                    </div>
                  </div>
                
                <div className="border-t border-white/20 pt-4 mt-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 mr-2 bg-white/20 rounded-full text-white/90 font-mono">
                    {participantData.registrationNumber}
                  </div>
                  <p className="text-xs text-white/60 italic mt-2">
                    Please wear this badge throughout the event
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Enter a Participant ID and click "Lookup Participant" to see the badge preview
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface BadgeGeneratorProps {
  onGenerateBadge: (participantId: number) => Promise<void>;
}

export function BadgeGenerator({ onGenerateBadge }: BadgeGeneratorProps) {
  const [participantId, setParticipantId] = React.useState<number | null>(null);
  const [participantData, setParticipantData] = React.useState<ParticipantData | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isLookupComplete, setIsLookupComplete] = React.useState(false);

  const handleLookupParticipant = async () => {
    if (!participantId) return;
    
    // In a real app, this would call an API to fetch participant data
    // For now, we'll simulate with mock data
    setIsLookupComplete(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock participant data based on ID
    const mockData: ParticipantData = {
      firstName: "John",
      lastName: "Doe",
      faydaId: `FYDA${participantId.toString().padStart(9, '0')}`,
      registrationNumber: `EY${Date.now()}${participantId.toString().padStart(4, '0')}`,
      eventName: "National Youth Conference 2026",
      roundNumber: 1
    };
    
    setParticipantData(mockData);
    setIsLookupComplete(true);
  };

  const handleGenerateBadge = async () => {
    if (!participantId) {
      toast({
        title: "Please enter a Participant ID",
        description: "Enter a valid participant ID to generate a badge",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateBadge(participantId);
      toast({
        title: "Badge generated successfully!",
        description: "Your badge is ready to print.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate badge",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Participant Badge</CardTitle>
          <CardDescription>
            Enter participant ID to generate a printable event badge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participant ID
              </label>
              <Input
                type="number"
                value={participantId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setParticipantId(value === "" ? null : parseInt(value));
                  // Reset participant data when ID changes
                  if (value === "") {
                    setParticipantData(null);
                    setIsLookupComplete(false);
                  }
                }}
                placeholder="Enter participant ID"
                required
                min="1"
              />
            </div>
            
            {!isLookupComplete && participantId && participantId > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Looking up participant...</span>
              </div>
            )}
            
            {isLookupComplete && participantData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Participant Information:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Name:</span>
                    <span className="text-gray-800">{participantData.firstName} {participantData.lastName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Fayda ID:</span>
                    <span className="text-gray-800 font-mono">{participantData.faydaId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Reg #:</span>
                    <span className="text-gray-800 font-mono">{participantData.registrationNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Event:</span>
                    <span className="text-gray-800">{participantData.eventName}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-20">Round:</span>
                    <span className="text-gray-800">{participantData.roundNumber}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-start">
          <div className="flex-1 space-x-3">
            <Button
              variant="outline"
              onClick={handleLookupParticipant}
              disabled={!participantId || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Processing..." : "Lookup Participant"}
            </Button>
            
            <Button
              variant="default"
              onClick={handleGenerateBadge}
              disabled={!isLookupComplete || !participantData || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Badge"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {participantData && isLookupComplete ? (
            <div className="relative h-[5.5in] w-[4in] bg-gradient-to-br from-[#2c3e50] to-[#4a6fa5] rounded-xl p-6 text-white shadow-lg overflow-hidden">
              {/* Security watermark */}
              <div className="absolute inset-0 flex items-center justify-center text-[80px] font-bold text-white/5 -rotate-12 select-none pointer-events-none">
                NTPC
              </div>
              
              {/* Header accent */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f39c12] via-[#e67e22] to-[#f1c40f]"></div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="border-b border-white/20 pb-4 mb-4">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                      ⛪
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white/90">NTPC Church</div>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-white/90">NTPC Event Badge</h2>
                  <p className="text-lg font-medium text-[#fdcb6e] bg-white/10 px-3 py-1 rounded-full inline-block">
                    {participantData.eventName}
                  </p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                  <div className="text-2xl font-bold text-white/95 tracking-wider">
                    {participantData.firstName} {participantData.lastName}
                  </div>
                  
                  <div className="space-y-2 w-full text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Fayda ID:</span>
                      <span className="text-white/90 font-mono">{participantData.faydaId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Reg #:</span>
                      <span className="text-white/90 font-mono">{participantData.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white/70">Round:</span>
                      <span className="text-white/90 font-mono">{participantData.roundNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 mt-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 mr-2 bg-white/20 rounded-full text-white/90 font-mono">
                    {participantData.registrationNumber}
                  </div>
                  <p className="text-xs text-white/60 italic mt-2">
                    Please wear this badge throughout the event
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Enter a Participant ID and click "Lookup Participant" to see the badge preview
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface BadgeGeneratorProps {
  onGenerateBadge: (participant: ParticipantData) => Promise<void>;
}

export function BadgeGenerator({ onGenerateBadge }: BadgeGeneratorProps) {
  const [participant, setParticipant] = React.useState<ParticipantData>({
    firstName: "",
    lastName: "",
    faydaId: "",
    registrationNumber: "",
    eventName: "",
    roundNumber: 1,
  });

  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerateBadge = async () => {
    setIsGenerating(true);
    try {
      await onGenerateBadge(participant);
      toast({
        title: "Badge generated successfully!",
        description: "Your badge is ready to print.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate badge",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Participant Badge</CardTitle>
          <CardDescription>
            Fill in participant information to generate a printable event badge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                value={participant.firstName}
                onChange={(e) =>
                  setParticipant((prev) => ({ ...prev, firstName: e.target.value }))
                }
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                value={participant.lastName}
                onChange={(e) =>
                  setParticipant((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="Enter last name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fayda ID
              </label>
              <Input
                value={participant.faydaId}
                onChange={(e) =>
                  setParticipant((prev) => ({ ...prev, faydaId: e.target.value }))
                }
                placeholder="Enter Fayda ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <Input
                value={participant.registrationNumber}
                onChange={(e) =>
                  setParticipant((prev) => ({
                    ...prev,
                    registrationNumber: e.target.value,
                  }))
                }
                placeholder="Enter registration number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <Input
                value={participant.eventName}
                onChange={(e) =>
                  setParticipant((prev) => ({ ...prev, eventName: e.target.value }))
                }
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round Number
              </label>
              <Select
                value={participant.roundNumber.toString()}
                onValueChange={(value) =>
                  setParticipant((prev) => ({
                    ...prev,
                    roundNumber: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select round" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((round) => (
                    <SelectItem key={round} value={round.toString()}>
                      Round {round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="default"
            onClick={handleGenerateBadge}
            disabled={isGenerating}
            className="w-48"
          >
            {isGenerating ? "Generating..." : "Generate Badge"}
          </Button>
        </CardFooter>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[5.5in] w-[4in] bg-gradient-to-br from-[#2c3e50] to-[#4a6fa5] rounded-xl p-6 text-white shadow-lg overflow-hidden">
            {/* Security watermark */}
            <div className="absolute inset-0 flex items-center justify-center text-[80px] font-bold text-white/5 -rotate-12 select-none pointer-events-none">
              NTPC
            </div>
            
            {/* Header accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f39c12] via-[#e67e22] to-[#f1c40f]"></div>

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="border-b border-white/20 pb-4 mb-4">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                    ⛪
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white/90">NTPC Church</div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white/90">NTPC Event Badge</h2>
                <p className="text-lg font-medium text-[#fdcb6e] bg-white/10 px-3 py-1 rounded-full inline-block">
                  {participant.eventName}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="text-2xl font-bold text-white/95 tracking-wider">
                  {participant.firstName} {participant.lastName}
                </div>
                
                <div className="space-y-2 w-full text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-white/70">Fayda ID:</span>
                    <span className="text-white/90 font-mono">{participant.faydaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white/70">Reg #:</span>
                    <span className="text-white/90 font-mono">{participant.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-white/70">Round:</span>
                    <span className="text-white/90 font-mono">{participant.roundNumber}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mt-4 text-center">
                <div className="inline-flex items-center px-3 py-1 mr-2 bg-white/20 rounded-full text-white/90 font-mono">
                  {participant.registrationNumber}
                </div>
                <p className="text-xs text-white/60 italic mt-2">
                  Please wear this badge throughout the event
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
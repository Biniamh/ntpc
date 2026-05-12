import React, { useState, useMemo } from "react";
import { Search, Download, Edit, Trash2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType } from "docx";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  exportable?: boolean;
  exportFileName?: string;
  itemsPerPage?: number;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onEdit,
  onDelete,
  loading = false,
  exportable = true,
  exportFileName = "data",
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) =>
      columns.some((column) => {
        if (!column.searchable) return false;
        const value = item[column.key as keyof T];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );

    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof T];
        const bValue = b[sortColumn as keyof T];

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection, columns]);

  // Paginate data
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.header).join(",");
    const rows = filteredAndSortedData.map(item =>
      columns.map(col => {
        const value = item[col.key as keyof T];
        return `"${value?.toString().replace(/"/g, '""') || ""}"`;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    downloadFile(csv, `${exportFileName}.csv`, "text/csv");
  };

  const exportToJSON = () => {
    const json = JSON.stringify(filteredAndSortedData, null, 2);
    downloadFile(json, `${exportFileName}.json`, "application/json");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAndSortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = columns.map(col => col.header);
    const rows = filteredAndSortedData.map(item =>
      columns.map(col => {
        const value = item[col.key as keyof T];
        return value?.toString() || "";
      })
    );

    let yPosition = 20;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 10;

    // Add title
    doc.setFontSize(16);
    doc.text(`${exportFileName} Data Export`, 20, yPosition);
    yPosition += 20;

    // Add headers
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      doc.text(header, 20 + (index * 40), yPosition);
    });
    yPosition += lineHeight;

    // Add data rows
    doc.setFont("helvetica", "normal");
    rows.forEach((row, rowIndex) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      row.forEach((cell, cellIndex) => {
        const truncatedCell = cell.length > 15 ? cell.substring(0, 15) + "..." : cell;
        doc.text(truncatedCell, 20 + (cellIndex * 40), yPosition);
      });
      yPosition += lineHeight;
    });

    doc.save(`${exportFileName}.pdf`);
  };

  const exportToDOC = async () => {
    const headers = columns.map(col => col.header);
    const rows = filteredAndSortedData.map(item =>
      columns.map(col => {
        const value = item[col.key as keyof T];
        return value?.toString() || "";
      })
    );

    const tableRows = [
      new DocxTableRow({
        children: headers.map(header =>
          new DocxTableCell({
            children: [new Paragraph(header)],
            width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
          })
        ),
      }),
      ...rows.map(row =>
        new DocxTableRow({
          children: row.map(cell =>
            new DocxTableCell({
              children: [new Paragraph(cell)],
              width: { size: 100 / headers.length, type: WidthType.PERCENTAGE },
            })
          ),
        })
      ),
    ];

    const table = new DocxTable({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    const doc = new Document({
      sections: [{
        children: [table],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([new Uint8Array(buffer)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFileName}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-72 bg-muted animate-pulse rounded" />
        </div>
        <div className="rounded-md border">
          <div className="h-12 bg-muted animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 animate-pulse border-t" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Export */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {exportable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToDOC}>
                Export as DOC
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key as string}
                  className={column.sortable ? "cursor-pointer select-none hover:bg-muted/50" : ""}
                  onClick={() => column.sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key as string}>
                      {column.render
                        ? column.render(item[column.key as keyof T], item)
                        : String(item[column.key as keyof T] || "")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(item)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNumber > totalPages) return null;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
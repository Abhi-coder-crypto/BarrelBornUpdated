import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Customer } from "@shared/schema";
import { Users, LayoutDashboard, Phone, Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import * as XLSX from 'xlsx';
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const limit = 10;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (date) {
    queryParams.append("year", date.getFullYear().toString());
    queryParams.append("month", (date.getMonth() + 1).toString());
    queryParams.append("day", date.getDate().toString());
  }

  const { data, isLoading, error } = useQuery<{ customers: Customer[]; total: number }>({
    queryKey: [`/api/customers?${queryParams.toString()}`],
    queryFn: async () => {
      const response = await fetch(`/api/customers?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    }
  });

  // Client-side range filtering since backend only supports single date
  const filteredCustomers = (data?.customers || []).filter((customer: Customer) => {
    if (!dateRange?.from) return true;
    const visitDate = new Date(customer.createdAt);
    const start = startOfDay(dateRange.from);
    const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
    return isWithinInterval(visitDate, { start, end });
  });

  const total = dateRange?.from ? filteredCustomers.length : (data?.total || 0);
  const displayCustomers = dateRange?.from ? filteredCustomers.slice((page - 1) * limit, page * limit) : (data?.customers || []);
  const totalPages = Math.ceil(total / limit);

  const handleExport = async () => {
    try {
      let exportData;
      if (dateRange?.from) {
        exportData = filteredCustomers.map((c: Customer) => ({
          Name: c.name,
          Phone: c.phone,
          "Created At": new Date(c.createdAt).toLocaleString()
        }));
      } else {
        const exportParams = new URLSearchParams();
        if (date) {
          exportParams.append("year", date.getFullYear().toString());
          exportParams.append("month", (date.getMonth() + 1).toString());
          exportParams.append("day", date.getDate().toString());
        }
        const response = await fetch(`/api/customers/export?${exportParams.toString()}`);
        exportData = await response.json();
      }
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Customers");
      const dateStr = dateRange?.from 
        ? `${format(dateRange.from, 'yyyy-MM-dd')}${dateRange.to ? `_to_${format(dateRange.to, 'yyyy-MM-dd')}` : ''}`
        : (date ? format(date, 'yyyy-MM-dd') : 'all');
      XLSX.writeFile(wb, `customers_report_${dateStr}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage and monitor customer visit records</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{total} Records Found</span>
            </div>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="space-y-2 w-full md:w-auto">
            <label className="text-sm font-medium text-muted-foreground block">Single Date Filter</label>
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={!!dateRange?.from}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => { setDate(d); setPage(1); }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button 
                  size="icon"
                  variant="ghost" 
                  onClick={() => { setDate(undefined); setPage(1); }}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2 w-full md:w-auto">
            <label className="text-sm font-medium text-muted-foreground block">Date Range Filter (Local)</label>
            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full md:w-[300px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                    disabled={!!date}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => { setDateRange(range); setPage(1); }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              {dateRange?.from && (
                <Button 
                  size="icon"
                  variant="ghost" 
                  onClick={() => { setDateRange(undefined); setPage(1); }}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 gap-4">
            <CardTitle className="text-xl font-semibold">Customer Records</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Customer Name</TableHead>
                    <TableHead className="font-semibold">Phone Number</TableHead>
                    <TableHead className="font-semibold">Visit Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayCustomers.map((customer: Customer) => (
                    <TableRow key={customer._id.toString()} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {customer.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(customer.createdAt), "dd/MM/yyyy")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                        No customer data available for selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

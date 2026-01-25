import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { leDirectoryData } from "./data"
import { ShieldAlert } from "lucide-react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">LEOR DIRECTORY</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <DataTable columns={columns} data={leDirectoryData} searchKey="platform" />
        </CardContent>
      </Card>

      <div className="mt-auto flex items-center justify-center gap-2 py-6 text-muted-foreground/60 select-none">
        <ShieldAlert className="h-4 w-4 text-orange-500/80" />
        <p className="text-xs font-medium tracking-widest uppercase">
          Law Enforcement & Intel Use Only
        </p>
      </div>
    </div>
  )
}

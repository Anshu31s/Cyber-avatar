import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Hash Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
             <h3 className="text-2xl font-bold tracking-tight">Feature Coming Soon</h3>
             <p className="text-muted-foreground">The Hash Analyzer module is currently under development.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

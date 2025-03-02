import Spreadsheet from "@/components/spreadsheet/spreadsheet"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
        <h1 className="text-2xl font-bold text-white text-center">Spreadsheet Application</h1>
      </header>
      <div className="container mx-auto py-6 px-4">
        <Spreadsheet />
      </div>
      <Toaster />
    </main>
  )
}
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashBoard() {
  return (
    <section className="flex-1 flex flex-col space-y-8 p-6 overflow-auto">
      <header className="flex items-center gap-2">
        <h2 className="text-2xl font-medium">Dashboard</h2>
      </header>

      <div className="grid  gap-4 md:grid-cols-6">
        {/* Card em destaque: ocupa 2 colunas */}
        <Card className=" col-span-2 row-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Este card é maior e chama mais atenção.</p>
          </CardContent>
        </Card>

        {/* Cards normais: 1 coluna cada */}
        <Card className="col-span-1">
          <CardHeader><CardTitle>Usuários</CardTitle></CardHeader>
          <CardContent><p className="text-2xl">1.245</p></CardContent>
        </Card>

        <Card className="col-span-3  md:col-span-2">
          <CardHeader><CardTitle>Vendas</CardTitle></CardHeader>
          <CardContent><p className="text-2xl">R$12.450</p></CardContent>
        </Card>

        {/* Outro card em destaque, ocupando 3 colunas */}
        <Card className="col-span-3">
          <CardHeader><CardTitle>Gráfico Semanal</CardTitle></CardHeader>
          <CardContent className="h-48">
            {/* aqui entraria seu gráfico */}
          </CardContent>
        </Card>

        {/* Mais cards normais */}
        <Card className="col-span-1">
          <CardHeader><CardTitle>Satisfação</CardTitle></CardHeader>
          <CardContent><p className="text-2xl">92%</p></CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader><CardTitle>Novos</CardTitle></CardHeader>
          <CardContent><p className="text-2xl">87</p></CardContent>
        </Card>
      </div>
    </section>
);
}

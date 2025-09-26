"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ProductTabs() {
  return (
    <div className="w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex gap-4 border-b mb-4 bg-transparent border-none">
          <TabsTrigger value="description" className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent">
            ОПИСАНИЯ
          </TabsTrigger>
          <TabsTrigger value="params" className="data-[state=active]:bg-transparent  data-[state=active]:text-black text-primary  data-[state=active]:font-bold shadow-none  data-[state=active]:shadow-none dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent">
            ПАРАМЕТРЫ
          </TabsTrigger>
        </TabsList>

        {/* Description tab */}
        <TabsContent value="description" className="space-y-4 text-xs md:text-sm leading-relaxed">
          <p>
            Зимой 2018 года миру была представлена сногсшибательная новинка от знаменитого парфюмерного бренда Christian Dior - Sauvage Eau De Parfum, которая сразу стала настоящим хитом среди искушенных и требовательных представителей сильного пола.
          </p>
          <p>
            Она отличается уникальной, таинственной восточной дымкой, которая вкупе с фужерным послевкусием создает поистине головокружительный эффект и позволяет почувствовать себя настоящим королем на мероприятии любого плана.
          </p>
          <p>
            Аромат Christian Dior Sauvage Eau De Parfum непременно понравится самым шикарным, благородным, жизнерадостным и оригинальным представителям сильного пола, которые не стесняются своего великолепия и любят чувствовать себя безукоризненно в абсолютно любом окружении.
          </p>
        </TabsContent>

        {/* Params tab */}
        <TabsContent value="params" className={"bg-primary/20 "}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Характеристика</TableHead>
                <TableHead>Значение</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Бренд</TableCell>
                <TableCell>Christian Dior</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Тип</TableCell>
                <TableCell>Eau De Parfum</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Год выпуска</TableCell>
                <TableCell>2018</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Пол</TableCell>
                <TableCell>Мужской</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Страна</TableCell>
                <TableCell>Франция</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

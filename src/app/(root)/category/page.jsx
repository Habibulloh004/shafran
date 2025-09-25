import CustomBackground from "@/components/shared/customBackground";
import famale from "@/assets/background/famale.webp";
import male from "@/assets/background/male.webp";
import { cn } from "@/lib/utils";
import ProductItem from "@/components/shared/productItem";
import SidebarFilter from "@/components/shared/sidebarFilter";

export default function CategoryPage({ searchParams }) {
  const gender = searchParams.gender;

  return (
    <CustomBackground
      singleImage={gender == "male" ? male : famale}
      className="relative w-full md:min-h-screen flex flex-col sm:gap-4 pt-12 sm:pt-24 pb-4"
      quality={100}
      type="single"
      classNameImage={cn(
        gender == "male" ? "opacity-20" : "opacity-50 dark:opacity-30"
      )}
      priority
    >
      <div className="w-11/12 containerCustom space-y-6">
        <h1 className="text-center text-3xl font-bold font-montserrat-alt">Парфюм для неё</h1>
        <div className="relative flex gap-6">
          {/* Sidebar */}
          <aside className="max-md:hidden w-64 shrink-0">
            <SidebarFilter />
          </aside>

          {/* Products */}
          <main className="flex-1 min-h-screen">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]?.map((item) => (
                <ProductItem key={item} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </CustomBackground>
  );
}
// Interfaces
export interface Product {
    _id?: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    imageUrl?: string;
  }
  
  export interface MenuSection {
    _id?: string;
    name: string;
    products: Product[];
  }
  
  export interface SubMenu {
    _id?: string;
    name: string;
    sections: MenuSection[];
  }
  
  export interface Menu {
    _id: string;
    barId: string | { _id: string; name: string };
    subMenus: SubMenu[];
  }
  
  export interface Bar {
    _id: string;
    name: string;
  }
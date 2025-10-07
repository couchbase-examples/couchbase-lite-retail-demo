export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  image: string;
  barcode: string;
  price: number;
  count: number;
}

export interface Order {
  id: string;
  itemName: string;
  itemId: string;
  count: number;
  status: 'submitted' | 'received';
  date: string;
}

export const inventoryData: InventoryItem[] = [
  // Produce Category
  {
    id: "PROD001",
    name: "Apples",
    category: "Produce",
    image: "/api/placeholder/150/150",
    barcode: "123456789012",
    price: 2.99,
    count: 45
  },
  {
    id: "PROD002", 
    name: "Bananas",
    category: "Produce",
    image: "/api/placeholder/150/150",
    barcode: "123456789013",
    price: 1.89,
    count: 32
  },
  {
    id: "PROD003",
    name: "Onions",
    category: "Produce", 
    image: "/api/placeholder/150/150",
    barcode: "123456789014",
    price: 1.49,
    count: 18
  },
  {
    id: "PROD004",
    name: "Tomatoes",
    category: "Produce",
    image: "/api/placeholder/150/150", 
    barcode: "123456789015",
    price: 3.49,
    count: 23
  },
  {
    id: "PROD005",
    name: "Lettuce",
    category: "Produce",
    image: "/api/placeholder/150/150",
    barcode: "123456789016", 
    price: 2.29,
    count: 15
  },
  
  // Beverages Category
  {
    id: "BEV001",
    name: "Apple Juice",
    category: "Beverages",
    image: "/api/placeholder/150/150",
    barcode: "223456789012",
    price: 4.99,
    count: 28
  },
  {
    id: "BEV002",
    name: "Cranberry Juice", 
    category: "Beverages",
    image: "/api/placeholder/150/150",
    barcode: "223456789013",
    price: 5.49,
    count: 12
  },
  {
    id: "BEV003",
    name: "Orange Juice",
    category: "Beverages",
    image: "/api/placeholder/150/150",
    barcode: "223456789014", 
    price: 4.79,
    count: 35
  },
  {
    id: "BEV004",
    name: "Sparkling Water",
    category: "Beverages",
    image: "/api/placeholder/150/150",
    barcode: "223456789015",
    price: 1.99,
    count: 67
  },
  {
    id: "BEV005",
    name: "Cola",
    category: "Beverages", 
    image: "/api/placeholder/150/150",
    barcode: "223456789016",
    price: 2.49,
    count: 48
  },

  // Dairy Category
  {
    id: "DAIRY001",
    name: "Milk",
    category: "Dairy",
    image: "/api/placeholder/150/150",
    barcode: "323456789012",
    price: 3.99,
    count: 22
  },
  {
    id: "DAIRY002",
    name: "Cheese",
    category: "Dairy",
    image: "/api/placeholder/150/150", 
    barcode: "323456789013",
    price: 6.49,
    count: 14
  },
  {
    id: "DAIRY003",
    name: "Yogurt",
    category: "Dairy",
    image: "/api/placeholder/150/150",
    barcode: "323456789014",
    price: 4.29,
    count: 31
  },

  // Snacks Category  
  {
    id: "SNACK001",
    name: "Potato Chips",
    category: "Snacks",
    image: "/api/placeholder/150/150",
    barcode: "423456789012", 
    price: 3.99,
    count: 56
  },
  {
    id: "SNACK002",
    name: "Crackers",
    category: "Snacks",
    image: "/api/placeholder/150/150",
    barcode: "423456789013",
    price: 2.79,
    count: 29
  },
  {
    id: "SNACK003",
    name: "Nuts",
    category: "Snacks",
    image: "/api/placeholder/150/150",
    barcode: "423456789014",
    price: 7.99,
    count: 18
  }
];

export const ordersData: Order[] = [
  {
    id: "ORD001",
    itemName: "Apples", 
    itemId: "PROD001",
    count: 20,
    status: "submitted",
    date: "2024-01-15"
  },
  {
    id: "ORD002",
    itemName: "Orange Juice",
    itemId: "BEV003", 
    count: 15,
    status: "submitted",
    date: "2024-01-14"
  },
  {
    id: "ORD003",
    itemName: "Milk",
    itemId: "DAIRY001",
    count: 12,
    status: "received",
    date: "2024-01-13"
  },
  {
    id: "ORD004",
    itemName: "Crackers",
    itemId: "SNACK002",
    count: 25,
    status: "received", 
    date: "2024-01-12"
  }
];

export const categories = Array.from(new Set(inventoryData.map(item => item.category))).sort();
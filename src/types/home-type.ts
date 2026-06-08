export interface SlideData {
  type: "content" | "image";
  title: string;
  highlight?: string;
  description: string;
  badge?: string;
  image?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface StatsData {
  value: string;
  label: string;
  icon: string;
  color: string;
}

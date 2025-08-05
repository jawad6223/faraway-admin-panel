import { IconType } from "react-icons";


interface NewYachtsFormField {
  label: string;
  required?: string;
  placeholder?: string;
  type?: "dropdown" | "number" | "text" | "checkbox";
  options?: string[];
  icon?: IconType;
  iconone?: IconType;
}
export const NewYachtsData: NewYachtsFormField[] = [
    { label: "Primary Image", placeholder: "" },
    { label: "Slug", placeholder: "" },
    { label: "Title", placeholder: "e.g,. Luxury" },
    { label: "Description", placeholder: "" },

]
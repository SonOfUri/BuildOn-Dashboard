import { Btn2Props } from "@/constants/types";

export const Btn2: React.FC<Btn2Props> = ({ text, css, onClick }) => (
  <button className={css} onClick={onClick}>
    {text}
  </button>
);

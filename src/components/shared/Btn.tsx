
export const Btn = ({ text, css }: { text: string; css?: string }) => {
  return (
    <div
      className={`bg-[#2A2A2ACC] w-fit py-2 px-2 rounded-md cursor-pointer u-btn1 ${css}`}
    >
      {text}
    </div>
  );
};

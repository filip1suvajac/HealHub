export default function PageHeading({
  text,
  size = "2xl",
  boja = "inherit",
  debel = "semibold",
}) {
  return (
    <h1 className={`text-${size} font-${debel} text-${boja} dark:text-white`}>
      {text}
    </h1>
  );
}

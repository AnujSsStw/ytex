import NavBar from "./Nav";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const layoutProps = {
    layoutProp: "Layout Prop Value",
  };
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export default RootLayout;

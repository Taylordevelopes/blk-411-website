import SectionLayout from "./components/SectionLayout";
import RowSection from "./components/RowSection";

export default function Home() {
  const columnData = [
    {
      title: "Who We Are",
      description:
        "Black Excellence Technology Group is a Black Owned Telecommunications firm that is looking to grow black business through technology.",
      buttonLabel: "Learn More >>",
      navigateTo: "/aboutus",
    },
    {
      title: "Why The Black 411",
      description:
        "Blacks earn over $1.3 Trillion dollars per year but yet experience the highest levels of poverty. Its is time we keep our dollars in our communities.",
      buttonLabel: "Register Your Business >>",
      navigateTo: "/registration",
    },
    {
      title: "Our Mission",
      description:
        "Provide a Targeted Information Service services to help consumers find and locate Black owned businesses across the nation.",
      buttonLabel: "View Features >>",
      navigateTo: "/features",
    },
  ];
  return (
    <>
      <SectionLayout
        heroImage="/homeheader.jpg"
        title="WHAT IS THE BLACK 411?"
        description={`Simply use your cell phone to text or call to find black-owned businesses.<br /> <br/>
          The Black 411 is not your same old Black Business Directory. It is not one of those apps that keeps slowing down your phone performance and that uses your phone memory.<br />
          We also are not an online directory that you have to do all the work to find the business, product or service you are looking for.<br /><br/>
          With The Black 411 all you do is Text or Call and we do it all!<br /> <br/>
          The Black 411 is a powerful new service that allows you to quickly find the black-owned business or service you are looking for Fast…. Simple…. Immediate!`}
        headerText=" Text '(Item/Business) in (Any U.S City and State)' to (208)225-5960!"
      />
      <RowSection columns={columnData} />
    </>
  );
}

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
        carouselImages={[
          {
            src: "/homeheader.jpg",
            headerText:
              "Stop manual searching... Texting is faster and more convenient... Use The Black 411. It's the fastest way to find black owned businesses. ",
            position: "top-left",
            maxWidth: "75%",
          },
          {
            src: "/header-pic-7.jpg",
            headerText:
              "There are now 2.6 Million Black owned Businesses in the U.S, There are Black Entrepreneurs in almost every field. The Black 411 provides a simple, fast and immediate way to find them when you need them!",
            position: "top-left",
            maxWidth: "90%",
            marginBottom: "20px",
          },
          {
            src: "/temp-header-3-3.jpg",
            headerText:
              "Blacks earn $1.3 Trillion and less than 3% of that goes to support black owned businesses..",
            position: "top-right",
            maxWidth: "100%",
          },
          {
            src: "/header-pic-8.jpg",
            headerText: "The time is now.. We can't afford to wait.",
            position: "center",
            maxWidth: "100%",
          },
        ]}
        title="WHAT IS THE BLACK 411?"
        description={`Simply use your cell phone to text or call to find black-owned businesses.<br /> <br/>
          The Black 411 is not your same old Black Business Directory. It is not one of those apps that keeps slowing down your phone performance and that uses your phone memory.<br />
          We also are not an online directory that you have to do all the work to find the business, product or service you are looking for.<br /><br/>
          With The Black 411 all you do is Text or Call and we do it all!<br /> <br/>
          The Black 411 is a powerful new service that allows you to quickly find the black-owned business or service you are looking for Fast…. Simple…. Immediate!`}
      />
      <RowSection columns={columnData} />
    </>
  );
}

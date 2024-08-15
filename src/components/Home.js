import Hero1 from "./Hero1";
import Hero2 from "./Hero2";
import RouteNav from "./RouteNav";
import LearningCentreLayout from "../LearningCentre/LearningCenterLayout";

function Home() {
  return (
    <div>
      <RouteNav />
      <Hero1 />
      <Hero2 />
    </div>
  );
}

export default Home;

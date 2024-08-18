import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";

const Home = () => {
  const loggedIn = { firstName: "Ranveer", lastName : "Singh", email:"ranveer@mail.com" };

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Acess and manage your Account and transaction effiectly"
          />

          <TotalBalanceBox 
          accounts = {[]}
          totalBanks = {1}
          totalCurrentBalance = {786.78}
          />
        </header>
        Recent Transaction
      </div>
      <RightSidebar 
      user = {loggedIn}
      transactions = {[]}
      banks = {[{currentBalance:122.02},{currentBalance:500.02}]}
      />
    </section>
  );
};

export default Home;

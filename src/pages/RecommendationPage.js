import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const coffeeMapping = {
  "Espresso": ["Flat White", "Macchiato", "Ristretto", "Affogato"],
  "Americano": ["Long Black", "Mocha", "Café au Lait"],
  "Latte": ["Honey Latte", "Chai Latte", "Flat White", "Cortado"],
  "Cappuccino": ["Viennese Coffee", "Caramel Cappuccino", "Mocha Cappuccino"],
  "Iced Latte": ["Iced Macchiato", "Iced Mocha", "Iced Flat White"],
  "Iced Americano": ["Cold Brew", "Iced Nitro Coffee", "Espresso Tonic"]
};

const RecommendationPage = () => {
  const { user } = useContext(AuthContext);
  const [recommendedCoffees, setRecommendedCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecommendations = async () => {
      if (!user) return;

      try {
        
        const response = await axios.get("/api/recipes/user-reactions");
        const likedRecipes = response.data.filter(item => item.reaction === "like");

        const likedCoffeeTitles = likedRecipes.map(item => item.title);

        const recommendations = new Set();

        likedCoffeeTitles.forEach(title => {
          const similar = coffeeMapping[title];
          if (similar) {
            similar.forEach(c => recommendations.add(c));
          }
        });

    
        const recommendedCoffeesData = await axios.get("/api/recipes");
        const recommendationsWithReactions = recommendedCoffeesData.data.filter(recipe =>
          recommendations.has(recipe.title)
        );

        setRecommendedCoffees(recommendationsWithReactions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      }
    };

    getRecommendations();
  }, [user]);

  const handleReaction = async (recipeId, reaction) => {
    if (!user) {
      alert("Please login to react to recommendations");
      return;
    }

    try {
      const response = await axios.post(`/api/recipes/${recipeId}/react`, { reaction });

      setRecommendedCoffees(recommendedCoffees.map(recipe =>
        recipe._id === recipeId
          ? { ...recipe, userReaction: reaction, reactions: response.data.reactions }
          : recipe
      ));
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  if (loading) {
    return <div className="loading" style={{ color: "white", background: "#0a0a0a", padding: "2rem", height: "50vh"}}>Loading recommendations...</div>;
  }

  return (
    <div className="recipe-page">
      <h2 style={{ textAlign: "center", color: "wheat", paddingTop: "2rem" , marginBottom: "30px"}}>
        Recommended Coffees Just For You ☕
      </h2>
      {recommendedCoffees.length === 0 ? (
        <p style={{ color: "white", padding: "2rem", height: "50vh"}}>
          Like some recipes to get recommendations!
        </p>
      ) : (
        recommendedCoffees.map((coffee) => (
          <div className="recipe-post" key={coffee._id}>
            <h2 className="recipe-title">{coffee.title}</h2>
            <img
              src={coffee.image}
              alt={coffee.title}
              className="recipe-image"
            />
            <p className="recipe-description">{coffee.description}</p>

            {/* Recipe Instructions Section */}
            <div className="recipe-content">
              <h4>Recipe Instructions</h4>
              <pre>{coffee.recipe}</pre>  
            </div>

            
            <div className="recipe-reactions">
              <button
                className={`reaction-btn ${coffee.userReaction === 'like' ? 'active' : ''}`}
                onClick={() => handleReaction(coffee._id, 'like')}
              >
                👍 {coffee.reactions?.likes || 0}
              </button>
              <button
                className={`reaction-btn ${coffee.userReaction === 'dislike' ? 'active' : ''}`}
                onClick={() => handleReaction(coffee._id, 'dislike')}
              >
                👎 {coffee.reactions?.dislikes || 0}
              </button>
              <button
                className={`reaction-btn ${coffee.userReaction === 'neutral' ? 'active' : ''}`}
                onClick={() => handleReaction(coffee._id, 'neutral')}
              >
                😐 {coffee.reactions?.neutral || 0}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecommendationPage;

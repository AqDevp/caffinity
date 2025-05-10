import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("/api/recipes");
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleReaction = async (recipeId, reaction) => {
    if (!user) {
      alert("Please login to react to recipes");
      return;
    }

    try {
      const response = await axios.post(`/api/recipes/${recipeId}/react`, { reaction });

      setRecipes(recipes.map(recipe =>
        recipe._id === recipeId
          ? { ...recipe, userReaction: reaction, reactions: response.data.reactions }
          : recipe
      ));
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  if (loading) {
    return <div className="loading" style={{ color: "white", background: "#0a0a0a", padding: "2rem", height: "50vh"}}>Loading recipes...</div>;
  }

  return (
    <div className="recipe-page">
      {recipes.map((recipe) => (
        <div className="recipe-post" key={recipe._id}>
          <h2 className="recipe-title">{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} className="recipe-image" />
          <p className="recipe-description">{recipe.description}</p>

          {/* Recipe Instructions Section */}
          <div className="recipe-content">
            <h4>Recipe Instructions</h4>
            <pre>{recipe.recipe}</pre>  {/* Display recipe steps */}
          </div>

          <div className="recipe-reactions">
            <button
              className={`reaction-btn ${recipe.userReaction === 'like' ? 'active' : ''}`}
              onClick={() => handleReaction(recipe._id, 'like')}
            >
              <i class="fas fa-thumbs-up"></i> {recipe.reactions?.likes || 0}
            </button>
            <button
              className={`reaction-btn ${recipe.userReaction === 'dislike' ? 'active' : ''}`}
              onClick={() => handleReaction(recipe._id, 'dislike')}
            >
              <i class="fas fa-thumbs-down"></i> {recipe.reactions?.dislikes || 0}
            </button>
            <button
              className={`reaction-btn ${recipe.userReaction === 'neutral' ? 'active' : ''}`}
              onClick={() => handleReaction(recipe._id, 'neutral')}
            >
              <i class="fas fa-meh"></i> {recipe.reactions?.neutral || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipePage;

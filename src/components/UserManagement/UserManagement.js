import React, { useState, useEffect } from "react";
import styles from "./UserManagement.module.css";
import { useNavigate } from "react-router-dom";
import Wrapper from "../../Wrapper";

function UserManagement() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editRecipeNotes, setEditRecipeNotes] = useState("");
  const [editRecipeGrindSetting, setEditRecipeGrindSetting] = useState("");
  const [editRecipeCoffeeDoseGrams, setEditRecipeCoffeeDoseGrams] =
    useState("");
  const [editRecipeWaterVolumeMl, setEditRecipeWaterVolumeMl] = useState("");
  const [
    editRecipeWaterTemperatureCelsius,
    setEditRecipeWaterTemperatureCelsius,
  ] = useState("");
  const [editRecipeBrewingTimeSeconds, setEditRecipeBrewingTimeSeconds] =
    useState("");

  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewComment, setEditReviewComment] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);
  const [updatedPassword, setUpdatedPassword] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setUpdatedEmail(data.email);
        setUpdatedUsername(data.username);

        fetch(`http://localhost:8080/api/recipes/user/${data.id}`)
          .then((res) => res.json())
          .then(setRecipes)
          .catch((err) => console.error("Error fetching recipes:", err));

        fetch(`http://localhost:8080/api/reviews/user/${data.id}`)
          .then((res) => res.json())
          .then(setReviews)
          .catch((err) => console.error("Error fetching reviews:", err));
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  const handleUpdateUser = async () => {
    setMessage("");
    setFieldErrors({});

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: updatedEmail,
            username: updatedUsername,
            password: updatedPassword || undefined,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setMessageType("success");
        setMessage("Profile updated successfully");
      } else {
        const errorData = await res.json();

        if (errorData.error) {
          setMessageType("error");
          setMessage(errorData.error);
        } else {
          setFieldErrors(errorData);
        }
      }
    } catch (err) {
      setMessageType("error");
      setMessage("Update failed: " + err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userData.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      setMessageType("success");
      alert("Account deleted successfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message);
    }
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    try {
      await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditRecipeId(recipe.id);
    setEditRecipeNotes(recipe.notes);
    setEditRecipeGrindSetting(recipe.grindSetting);
    setEditRecipeCoffeeDoseGrams(recipe.coffeeDoseGrams);
    setEditRecipeWaterVolumeMl(recipe.waterVolumeMl);
    setEditRecipeWaterTemperatureCelsius(recipe.waterTemperatureCelsius);
    setEditRecipeBrewingTimeSeconds(recipe.brewingTimeSeconds);
  };

  const handleSaveRecipe = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          notes: editRecipeNotes,
          grindSetting: editRecipeGrindSetting,
          coffeeDoseGrams: editRecipeCoffeeDoseGrams,
          waterVolumeMl: editRecipeWaterVolumeMl,
          waterTemperatureCelsius: editRecipeWaterTemperatureCelsius,
          brewingTimeSeconds: editRecipeBrewingTimeSeconds,
        }),
      });
      if (res.ok) {
        const updatedRecipe = await res.json();
        setRecipes(recipes.map((r) => (r.id === id ? updatedRecipe : r)));
        setEditRecipeId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`http://localhost:8080/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = (review) => {
    setEditReviewId(review.id);
    setEditReviewComment(review.comment);
    setEditReviewRating(review.rating);
  };

  const handleSaveReview = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          comment: editReviewComment,
          rating: editReviewRating,
        }),
      });
      if (res.ok) {
        const updated = reviews.map((r) =>
          r.id === id
            ? { ...r, comment: editReviewComment, rating: editReviewRating }
            : r
        );
        setReviews(updated);
        setEditReviewId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className={styles.bcg}>
      <Wrapper>
        <div className={styles.container}>
          <h2 className={styles.title}>my profile</h2>

          {message && (
            <p
              className={`${styles.message} ${
                messageType === "error"
                  ? styles.messageError
                  : styles.messageSuccess
              }`}
            >
              {message}
            </p>
          )}

          <div className={styles.userDetails}>
            <div className={styles.userDtlSingle}>
              <div>
                <p>
                  <strong>Username:</strong> {userData.username}
                </p>
              </div>
              <br />
              <div>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
              </div>
              <br />
            </div>
          </div>

          <label className={styles.profileUpdate}>change username: </label>
          {fieldErrors.username && (
            <p className={styles.fieldError}>{fieldErrors.username}</p>
          )}
          <input
            type="text"
            value={updatedUsername}
            onChange={(e) => setUpdatedUsername(e.target.value)}
            className={styles.input}
          />
          <br />

          <label className={styles.profileUpdate}>change email: </label>
          {fieldErrors.email && (
            <p className={styles.fieldError}>{fieldErrors.email}</p>
          )}
          <input
            type="text"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            className={styles.input}
          />
          <br />

          <label className={styles.profileUpdate}>change password: </label>
          {fieldErrors.password && (
            <p className={styles.fieldError}>{fieldErrors.password}</p>
          )}
          <input
            type="password"
            value={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)}
            className={styles.input}
          />
          <br />

          <button onClick={handleUpdateUser} className={styles.button}>
            update profile
          </button>

          <h3 style={{ marginTop: "20px" }}>delete account</h3>
          <button
            onClick={handleDeleteUser}
            className={`${styles.button} ${styles.deleteButton}`}
          >
            delete my account
          </button>
        </div>

        <div className={styles.container2}>
          <h3 className={styles.title}>my recipes</h3>
          {recipes.length > 0 ? (
            <table className={styles.recipeTable}>
              <thead>
                <tr>
                  <th>coffee</th>
                  <th>brewing method</th>
                  <th>grind setting</th>
                  <th>coffee dose</th>
                  <th>water volume</th>
                  <th>water temperature</th>
                  <th>brewing time</th>
                  <th>notes</th>
                </tr>
              </thead>

              <tbody>
                {recipes.map((r) => (
                  <tr key={r.id}>
                    <td>{r.coffeeName}</td>
                    <td>{r.brewingMethodName}</td>

                    <td>
                      {editRecipeId === r.id ? (
                        <input
                          type="number"
                          value={editRecipeGrindSetting}
                          onChange={(e) =>
                            setEditRecipeGrindSetting(e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        r.grindSetting
                      )}
                    </td>
                    <td>
                      {editRecipeId === r.id ? (
                        <input
                          type="number"
                          value={editRecipeCoffeeDoseGrams}
                          onChange={(e) =>
                            setEditRecipeCoffeeDoseGrams(e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        r.coffeeDoseGrams
                      )}
                    </td>

                    <td>
                      {editRecipeId === r.id ? (
                        <input
                          type="number"
                          value={editRecipeWaterVolumeMl}
                          onChange={(e) =>
                            setEditRecipeWaterVolumeMl(e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        r.waterVolumeMl
                      )}
                    </td>
                    <td>
                      {editRecipeId === r.id ? (
                        <input
                          type="number"
                          value={editRecipeWaterTemperatureCelsius}
                          onChange={(e) =>
                            setEditRecipeWaterTemperatureCelsius(e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        r.waterTemperatureCelsius
                      )}
                    </td>
                    <td>
                      {editRecipeId === r.id ? (
                        <input
                          type="number"
                          value={editRecipeBrewingTimeSeconds}
                          onChange={(e) =>
                            setEditRecipeBrewingTimeSeconds(e.target.value)
                          }
                          className={styles.input}
                        />
                      ) : (
                        r.brewingTimeSeconds
                      )}
                    </td>
                    <td className={styles.notes}>
                      {editRecipeId === r.id ? (
                        <textarea
                          value={editRecipeNotes}
                          onChange={(e) => setEditRecipeNotes(e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        r.notes
                      )}
                    </td>

                    <td>
                      {editRecipeId === r.id ? (
                        <button
                          onClick={() => handleSaveRecipe(r.id)}
                          className={styles.btnRecRev}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditRecipe(r)}
                          className={styles.btnRecRev}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteRecipe(r.id)}
                        className={styles.del}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You haven't written any recipes yet.</p>
          )}
        </div>

        <div className={styles.container2}>
          <h3 className={styles.title}>my reviews</h3>
          {reviews.length > 0 ? (
            <table className={styles.recipeTable}>
              <thead>
                <tr>
                  <th>coffee</th>
                  <th>rating</th>
                  <th>comment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id}>
                    <td>{rev.coffeeName}</td>
                    <td>
                      {editReviewId === rev.id ? (
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={editReviewRating}
                          onChange={(e) => setEditReviewRating(e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        rev.rating
                      )}
                    </td>
                    <td>
                      {editReviewId === rev.id ? (
                        <textarea
                          value={editReviewComment}
                          onChange={(e) => setEditReviewComment(e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        rev.comment
                      )}
                    </td>
                    <td>
                      {editReviewId === rev.id ? (
                        <button
                          onClick={() => handleSaveReview(rev.id)}
                          className={styles.btnRecRev}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditReview(rev)}
                          className={styles.btnRecRev}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className={styles.del}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You haven't written any reviews yet.</p>
          )}
        </div>
      </Wrapper>
    </div>
  );
}

export default UserManagement;

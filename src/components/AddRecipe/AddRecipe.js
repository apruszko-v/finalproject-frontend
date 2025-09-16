import Wrapper from "../../Wrapper";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddRecipe.module.css";

function AddRecipe() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [coffeeId, setCoffeeId] = useState("");
  const [grinderId, setGrinderId] = useState("");
  const [brewingMethodId, setBrewingMethodId] = useState("");
  const [grindSetting, setGrindSetting] = useState("");
  const [coffeeDoseGrams, setCoffeeDoseGrams] = useState("");
  const [waterVolumeMl, setWaterVolumeMl] = useState("");
  const [waterTemperatureCelsius, setWaterTemperatureCelsius] = useState("");
  const [brewingTimeSeconds, setBrewingTimeSeconds] = useState("");
  const [notes, setNotes] = useState("");

  const [coffees, setCoffees] = useState([]);
  const [grinders, setGrinders] = useState([]);
  const [brewingMethods, setBrewingMethods] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not logged in");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.id) {
          throw new Error("No userID found");
        }
        setUserId(data.id);
      })
      .catch((err) => {
        console.error("Error fetching users: ", err);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:8080/api/coffees")
      .then((res) => res.json())
      .then((data) => setCoffees(data))
      .catch((err) => console.error("Error fetching coffees: ", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/grinders")
      .then((res) => res.json())
      .then((data) => setGrinders(data))
      .catch((err) => console.error("Error fetching grinders:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/brewing-methods")
      .then((res) => res.json())
      .then((data) => setBrewingMethods(data))
      .catch((err) => console.error("Error fetching brewing methods:", err));
  }, []);

  const handleAddRecipe = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Brak userId – zaloguj się!");
      return;
    }

    const newRecipe = {
      userId,
      coffeeId: Number(coffeeId),
      grinderId: grinderId ? Number(grinderId) : null,
      brewingMethodId: brewingMethodId ? Number(brewingMethodId) : null,
      grindSetting,
      coffeeDoseGrams,
      waterVolumeMl,
      waterTemperatureCelsius,
      brewingTimeSeconds,
      notes,
    };

    console.log("Wysyłam do API:", newRecipe);

    try {
      const response = await fetch("http://localhost:8080/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Błąd backendu:", text);
        throw new Error("Failed to add recipe");
      }

      alert("Recipe added successfully!");
      navigate("/discover");

      setCoffeeId("");
      setGrinderId("");
      setBrewingMethodId("");
      setGrindSetting("");
      setCoffeeDoseGrams("");
      setWaterVolumeMl("");
      setWaterTemperatureCelsius("");
      setBrewingTimeSeconds("");
      setNotes("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.bcg}>
    <Wrapper>
      <div>
        <h2 className={styles.title}>add your recipe</h2>

        <form onSubmit={handleAddRecipe} className={styles.form}>
          <select
            className={styles.input}
            value={coffeeId}
            onChange={(e) => setCoffeeId(e.target.value)}
            required
          >
            <option value="">Select Coffee</option>
            {coffees.map((coffee) => (
              <option key={coffee.id} value={coffee.id}>
                {coffee.nameCoffee}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={grinderId}
            onChange={(e) => setGrinderId(e.target.value)}
          >
            <option value="">Select Grinder</option>
            {grinders.map((grinder) => (
              <option key={grinder.id} value={grinder.id}>
                {grinder.nameGrinder}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={brewingMethodId}
            onChange={(e) => setBrewingMethodId(e.target.value)}
          >
            <option value="">Select Brewing Method</option>
            {brewingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.nameMethod}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            type="number"
            placeholder="Grind Setting"
            value={grindSetting}
            onChange={(e) => setGrindSetting(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="number"
            placeholder="Coffee Dose (grams)"
            value={coffeeDoseGrams}
            onChange={(e) => setCoffeeDoseGrams(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="number"
            placeholder="Water Volume (ml)"
            value={waterVolumeMl}
            onChange={(e) => setWaterVolumeMl(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="number"
            placeholder="Water Temperature (°C)"
            value={waterTemperatureCelsius}
            onChange={(e) => setWaterTemperatureCelsius(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="number"
            placeholder="Brewing Time (seconds)"
            value={brewingTimeSeconds}
            onChange={(e) => setBrewingTimeSeconds(e.target.value)}
            required
          />

          <textarea
            className={styles.input}
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          ></textarea>

          <button className={styles.button} type="submit">
            Add Recipe
          </button>
        </form>
      </div>
    </Wrapper>
    </div>
  );
}

export default AddRecipe;

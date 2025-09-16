import React, { useState, useEffect } from "react";
import styles from "./Discover.module.css";
import FilterSection from "../FilterSection/FilterSection";
import Wrapper from "../../Wrapper";
import { Link } from "react-router-dom";

function Discover() {
  const [coffees, setCoffees] = useState([]);

  const [origins, setOrigins] = useState([]);
  const [methods, setMethods] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [roastLevels, setRoastLevels] = useState([]);

  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  const [selectedRoastLevels, setSelectedRoastLevels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/coffees/origins")
      .then((res) => res.json())
      .then((data) => setOrigins(data))
      .catch(console.error);

    fetch("http://localhost:8080/api/coffees/brewing-methods")
      .then((res) => res.json())
      .then((data) => setMethods(data))
      .catch(console.error);

    fetch("http://localhost:8080/api/coffees/flavour-notes")
      .then((res) => res.json())
      .then((data) => setFlavours(data))
      .catch(console.error);

    fetch("http://localhost:8080/api/coffees/roast-levels")
      .then((res) => res.json())
      .then((data) => setRoastLevels(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    selectedOrigins.forEach((o) => params.append("origin", o));
    selectedMethods.forEach((m) => params.append("brewingMethod", m));
    selectedFlavours.forEach((f) => params.append("flavourNote", f));
    selectedRoastLevels.forEach((r) => params.append("roastLevel", r));

    fetch(`http://localhost:8080/api/coffees/filter?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCoffees(data))
      .catch(console.error);
  }, [selectedOrigins, selectedMethods, selectedFlavours, selectedRoastLevels]);

  return (
    <div className={styles.discoverBcg}>
      <Wrapper>
        <div className={styles.discoverPage}>
          <aside className={styles.filters}>
            <FilterSection
              title="Coffee Bean Origin"
              options={origins}
              selected={selectedOrigins}
              onChange={setSelectedOrigins}
            />
            <FilterSection
              title="Brewing Method"
              options={methods}
              selected={selectedMethods}
              onChange={setSelectedMethods}
            />
            <FilterSection
              title="Flavour Notes"
              options={flavours}
              selected={selectedFlavours}
              onChange={setSelectedFlavours}
            />
            <FilterSection
              title="Roast Level"
              options={roastLevels}
              selected={selectedRoastLevels}
              onChange={setSelectedRoastLevels}
            />
          </aside>

          <section className={styles.coffeeList}>
            {coffees.map((coffee) => (
              <Link
                to={`/coffee/${coffee.id}`}
                key={coffee.id}
                className={styles.coffeeCard}
              >
                <div key={coffee.id} className={styles.coffeeCard2}>
                  <img
                    className={styles.coffeeImage}
                    src={coffee.imageUrl}
                    alt={coffee.nameCoffee}
                  />
                  <div className={styles.titleRating}>
                    <h3>{coffee.nameCoffee}</h3>
                    <p className={styles.rating}>
                      {coffee.ratingCoffee
                        ? coffee.ratingCoffee.toFixed(1)
                        : "No rating"}
                      ★
                    </p>
                  </div>

                  <p>
                    <span className={styles.coffeeDescription}>
                      {coffee.description}
                    </span>
                  </p>

                  <p>
                    <span className={styles.coffeeParam}>Roastery:</span>{" "}
                    {coffee.roastery}
                  </p>

                  <p>
                    <span className={styles.coffeeParam}>Origin:</span>{" "}
                    {coffee.origin}
                  </p>
                  <p>
                    <span className={styles.coffeeParam}>Roast:</span>{" "}
                    {coffee.roastLevel}
                  </p>
                  <p>
                    <span className={styles.coffeeParam}>Flavour Notes:</span>{" "}
                    {Array.from(coffee.flavourNotes).join(", ")}
                  </p>
                  <p>
                    <span className={styles.coffeeParam}>
                      Brewing Methods:{" "}
                    </span>
                    {Array.from(coffee.recommendedMethods).join(", ")}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        </div>
      </Wrapper>
    </div>
  );
}

export default Discover;

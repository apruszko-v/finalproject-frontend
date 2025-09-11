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
                <div key={coffee.id} className={styles.coffeeCard}>
                  <img
                    className={styles.coffeeImage}
                    src={coffee.imageUrl}
                    alt={coffee.nameCoffee}
                  />
                  <h3>{coffee.nameCoffee}</h3>
                  <p>Roastery: {coffee.roastery}</p>
                  <p>{coffee.description}</p>
                  <p>Origin: {coffee.origin}</p>
                  <p>Roast: {coffee.roastLevel}</p>
                  <p>
                    Flavour Notes: {Array.from(coffee.flavourNotes).join(", ")}
                  </p>
                  <p>
                    Brewing Methods:{" "}
                    {Array.from(coffee.recommendedMethods).join(", ")}
                  </p>
                  <p className={styles.rating}>Rating: {coffee.ratingCoffee}</p>
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

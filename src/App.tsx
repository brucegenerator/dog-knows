import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // create a loading container until the data is fetched
  // create a state to store the data
  // fetch the data from the api (list all dog breeds)
  // store the data in the state
  // fetch random images of the dog breeds
  // display the data in the UI
  console.log("App component!");
  const [data, setData] = useState<Record<string, string[]>>();
  const [searchedBreeds, setSearchedBreeds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBreeds, setFilteredBreeds] = useState<string[]>([]);

  const [randomImages, setRandomImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://dog.ceo/api/breeds/list/all";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        const breedList: Record<string, string[]> = result.message;
        setData(breedList);
      } catch (error) {
        console.log("error", error);
        console.error("something broke", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (data) {
    console.log("data", data);
  }

  useEffect(() => {
    if (!data) return;
    if (searchTerm.trim() === "") {
      setFilteredBreeds([]);
    } else {
      const filteredBreeds = Object.keys(data).filter((breed) =>
        breed.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );
      setFilteredBreeds(filteredBreeds);
    }
  }, [data, searchTerm]);

  const fetchRandomImages = async () => {
    if (!data) return;
    const breedList = Object.keys(data);
    const randomBreed: string =
      breedList && breedList.length > 0
        ? breedList[Math.floor(Math.random() * breedList.length)]
        : "unknown";
    const url = `https://dog.ceo/api/breed/${randomBreed}/images/random`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log("result", result);
      setRandomImages((prevImages) => [...prevImages, result.message]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchTerm = async (searchTerm: string) => {
    if (!data) return;
    const url = `https://dog.ceo/api/breed/${searchTerm}/images/random`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log("result", result);
      setSearchedBreeds((prevSearch) => [...prevSearch, result.message]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedBreed = (breed: string) => {
    setSearchTerm(breed);
    setFilteredBreeds([]);
    fetchSearchTerm(breed);
  };

  if (loading) {
    return <div data-id="LOADING CONTAINER">Loading...</div>;
  }
  return (
    <>
      <div>
        <h1>Random Dog breeds</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => fetchSearchTerm(searchTerm)}>Search</button>
        {searchedBreeds.length > 0 ? (
          <ul>
            {searchedBreeds.map((breed, index) => {
              return (
                <li>
                  <img
                    key={index}
                    src={breed}
                    alt="dog"
                    width="200"
                    height="200"
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <li>No breeds found</li>
        )}
        <div>
          {filteredBreeds.length > 0 ? (
            <ul>
              {filteredBreeds.map((breed, index) => (
                <li onClick={() => handleSelectedBreed(breed)} key={index}>
                  {breed}
                </li>
              ))}
            </ul>
          ) : (
            <li>No breeds found</li>
          )}
        </div>
        <button onClick={() => fetchRandomImages()}>Fetch Random Images</button>
        <div>
          {randomImages.length > 0 &&
            randomImages.map((img, index) => (
              <img key={index} src={img} alt="dog" width="200" height="200" />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;

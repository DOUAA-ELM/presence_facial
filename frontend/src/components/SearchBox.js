import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery) {
      const { data } = await axios.get(
        `/api/products/suggest?query=${searchQuery}`
      );
      setSuggestions(data);
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };
  // kat khlli onclick t executa 9bl mn onblur
  const handleInputBlur = () => {
    setTimeout(() => {
      setSuggestions([]);
    }, 100);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup className="suggestions-container">
        <FormControl
          type="text"
          name="q"
          id="q"
          value={query}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="rechercher..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search"></i>
        </Button>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => handleSuggestionClick(product.name)}
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </InputGroup>
    </Form>
  );
}

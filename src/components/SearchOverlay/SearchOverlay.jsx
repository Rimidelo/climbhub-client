// src/components/SearchOverlay/SearchOverlay.jsx

import React, { useState } from 'react';
import {
  Popover,
  TextField,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List as MUIList,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SearchOverlay({ anchorEl, open, onClose }) {
  const navigate = useNavigate();

  // Local states for search query and results
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Handle typing in the search field
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      // Example fetch from your backend
      fetch(`/api/users/search?q=${encodeURIComponent(value)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error(err));
    } else {
      setResults([]);
    }
  };

  // Clicking on a result
  const handleResultClick = (userId) => {
    // Navigate to the user's profile
    navigate(`/profile/${userId}`);
    // Close the popover
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      // Control the position of the popover relative to the icon
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          width: 250, // Adjust width as needed
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        },
      }}
    >
      {/* TextField for typing the query */}
      <TextField
        autoFocus
        variant="outlined"
        size="small"
        placeholder="Search users..."
        value={query}
        onChange={handleSearchChange}
      />

      {/* Results list */}
      <MUIList sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
        {results.map((user) => (
          <ListItem
            button
            key={user.id}
            onClick={() => handleResultClick(user.id)}
          >
            <ListItemAvatar>
              <Avatar src={user.profilePhotoUrl} />
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              secondary={user.displayName}
            />
          </ListItem>
        ))}
      </MUIList>
    </Popover>
  );
}

export default SearchOverlay;

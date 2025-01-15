// src/components/SearchOverlay/SearchOverlay.jsx
import React, { useState, useEffect } from 'react';
import {
  Popover,
  TextField,
  Avatar,
  ListItemAvatar,
  ListItemText,
  List as MUIList,
  ListItemButton, // Import ListItemButton from MUI
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchProfiles } from './../../API/api';

function SearchOverlay({ anchorEl, open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Function to call the API
  const doSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    try {
      const profiles = await searchProfiles(searchTerm);
      setResults(profiles);
    } catch (err) {
      console.error('Error searching profiles:', err);
      setResults([]);
    }
  };

  // Debounce the search input: when `query` changes, wait 300ms before calling doSearch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        doSearch(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (profile) => {
    // Navigate to /profile/:userId.
    // Your backend's getProfile expects a user id; for example, use profile.user._id.
    navigate(`/profile/${profile.user._id}`);
    onClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl} // Must be a visible DOM element
      onClose={onClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      PaperProps={{
        sx: {
          width: 250,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        },
      }}
    >
      <TextField
        autoFocus
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={query}
        onChange={handleSearchChange}
      />

      <MUIList sx={{ maxHeight: 300, overflowY: 'auto', mt: 1 }}>
        {results.map((profile) => (
          <ListItemButton
            key={profile._id}
            onClick={() => handleResultClick(profile)}
          >
            <ListItemAvatar>
              <Avatar src={profile.user?.image || ''} />
            </ListItemAvatar>
            <ListItemText
              primary={profile.user?.name || 'Unknown User'}
              secondary={profile.skillLevel || ''}
            />
          </ListItemButton>
        ))}
      </MUIList>
    </Popover>
  );
}

export default SearchOverlay;

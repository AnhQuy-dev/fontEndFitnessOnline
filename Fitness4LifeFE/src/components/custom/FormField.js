// FormField.js
import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const FormField = ({ label, name, value, onChange, type = 'text', options = [], error }) => {
  if (type === 'select') {
    return (
      <FormControl fullWidth margin="normal" error={!!error}>
        <InputLabel>{label}</InputLabel>
        <Select
          name={name}
          value={value || ''}
          onChange={onChange}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
      </FormControl>
    );
  }

  return (
    <TextField
      label={label}
      name={name}
      value={value || ''}
      onChange={onChange}
      fullWidth
      margin="normal"
      multiline={type === 'textarea'}
      rows={type === 'textarea' ? 4 : 1}
      error={!!error}
      helperText={error}
    />
  );
};

export default FormField;
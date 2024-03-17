'use client';
import { ClickAwayListener, Fade, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { Send } from 'lucide-react';
import React from 'react';

interface Props {
  fullWidth?: boolean;
  name: string;
  label?: string;
  value: string | number;
  type?: 'text' | 'number';
  onChangeFunction: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EditableTextField = ({ fullWidth, name, type, value, label, onChangeFunction }: Props) => {
  const [readOnly, setReadOnly] = React.useState(true);
  return (
    <ClickAwayListener onClickAway={() => setReadOnly(true)}>
      <Tooltip placement={'bottom-end'} title={'Double Click to Edit'}>
        <TextField
          fullWidth={fullWidth}
          type={type ? type : 'text'}
          name={name}
          label={label}
          value={value}
          onChange={e => onChangeFunction(e)}
          InputProps={{
            readOnly: readOnly,
            endAdornment: (
              <InputAdornment position='end'>
                {!readOnly ? (
                  <Fade in={!readOnly}>
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                        setReadOnly(true);
                      }}
                    >
                      <Send size={20} />
                    </IconButton>
                  </Fade>
                ) : null}
              </InputAdornment>
            ),
          }}
          onDoubleClick={() => setReadOnly(false)}
          inputProps={{ style: { cursor: 'pointer' }, maxLength: 255 }}
        />
      </Tooltip>
    </ClickAwayListener>
  );
};

export default EditableTextField;

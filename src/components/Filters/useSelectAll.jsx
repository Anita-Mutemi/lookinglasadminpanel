import { Button } from 'antd';
import React, { useCallback, useMemo } from 'react';

export function useSelectAll({
  showSelectAll = true,
  options = [],
  value,
  onChange,
}) {
  const handleSelectAll = useCallback(() => {
    if (onChange) {
      onChange(
        options.map((option) => option.value),
        options,
      );
    }
  }, [onChange, options]);

  const handleUnselectAll = useCallback(() => {
    if (onChange) {
      onChange([], []);
    }
  }, [onChange]);

  const enchancedOptions = useMemo(() => {
    if (!showSelectAll) return options;

    return [
      {
        label:
          !value || value.length === 0 ? (
            <Button type='link' onClick={handleSelectAll}>
              Select All
            </Button>
          ) : (
            <Button type='link' onClick={handleUnselectAll}>
              Unselect All
            </Button>
          ),
        options,
      },
    ];
  }, [handleSelectAll, handleUnselectAll, options, showSelectAll, value]);

  return {
    options: enchancedOptions,
    value,
    onChange,
  };
}

import { useState, useCallback, useEffect } from 'react';

export const useCheckbox = () => {
  const [checks, setChecks] = useState<{ id: number | null; checked: boolean }[]>([]);

  const handleChecked = (inputIndex: number) => {
    const newChecks = checks.map((check, index) => {
      if (index == inputIndex) {
        check.checked = !check.checked;
      }
      return check;
    });
    return setChecks(newChecks);
  };

  //チェックボックス全選択
  const handleBulkChecked = (checked: boolean) => {
    const newChecks = checks.map((check) => {
      if (checked) {
        check.checked = true;
      } else {
        check.checked = false;
      }
      return check;
    });
    return setChecks(newChecks);
  };

  //1個だけ選択
  const handleSingleChecked = (inputIndex: number) => {
    const newChecks = checks.map((check, index) => {
      if (inputIndex == index) {
        check.checked = true;
      } else {
        check.checked = false;
      }
      return check;
    });
    return setChecks(newChecks);
  };

  //選択中のチェックボックス
  const selectChecks = checks.filter((check) => {
    return check.checked == true;
  });

  //選択したid
  const checkedIds = selectChecks.map((check) => {
    return { id: check.id };
  });

  return {
    checks,
    setChecks,
    handleChecked,
    handleBulkChecked,
    handleSingleChecked,
    selectChecks,
    checkedIds,
  };
};

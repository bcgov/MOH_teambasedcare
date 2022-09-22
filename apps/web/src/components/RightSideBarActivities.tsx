/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState } from 'react';
import { Checkbox } from '@components';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import { useCareActivities } from '../services';

export const RightSideBarActivites: React.FC = () => {
  const [searchValue, setSearchValue]: [string, (search: string) => void] = useState('');
  const { values } = useFormikContext<any>();
  const [items, setItems] = useState<any>();
  const { careActivities } = useCareActivities();

  //useEFFECTS
  useEffect(() => {
    if (!_.isUndefined(careActivities)) {
      const newCareActivity = _.find(careActivities.result, function (o) {
        return o.id == values.careActivityID;
      });
      setItems(newCareActivity);
      //Set checked ids to previously selected ids when care activity changes
      values.careActivities = _.filter(values.careActivityBundle[values.careActivityID]);
    }
  }, [values.careActivityID, careActivities]);

  useEffect(() => {
    if (values.careActivityID) {
      values.careActivityBundle[values.careActivityID] = values.careActivities;
    }
  }, [values.careActivities]);

  // Get search value
  const handleSearch = (e: { target: { value: string } }) => {
    setSearchValue(e.target.value);
  };
  // Filter data with search value
  const filteredData =
    items &&
    items.careActivities.filter((item: any) => {
      return item.name.toLowerCase().includes(searchValue.toLowerCase());
    });

  // Get search value
  const handleSearchAll = () => {};

  return (
    <div className='w-2/3 ml-4 mt-4 border-2 border-gray-200 p-4'>
      {_.isEmpty(values.careActivityID) ? (
        <p className='text-center text-sm mt-4'>
          Please select an activity bundle on the left side.
        </p>
      ) : (
        <>
          <div className='justify-between text-bcBluePrimary w-full items-center mb-4 border-b-2 border-gray-200 pb-4'>
            <label>
              <input type='checkbox' name='selectAll' className='mr-3' onChange={handleSearchAll} />
              Select all
            </label>
          </div>

          <input
            type='text'
            name='search'
            placeholder='Search '
            className='block w-full text-sm text-slate-500 border-2 border-gray-200 p-2'
            value={searchValue}
            onChange={handleSearch}
          />

          <p className='text-sm text-gray-400'>
            {items && items.careActivities.length} Care Activities Tasks and Restricted Tasks
          </p>

          <div
            className='mt-4'
            role='group'
            aria-labelledby='checkbox-group'
            style={{ overflow: 'auto', maxHeight: '400px' }}
          >
            {!_.isEmpty(filteredData) ? (
              filteredData &&
              filteredData.map((item: any) => {
                return (
                  <div key={item.id}>
                    <Checkbox name='careActivities' value={item.id} label={item.name} />
                  </div>
                );
              })
            ) : (
              <p className='text-center text-sm mt-4'>No available Care Activity Tasks.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
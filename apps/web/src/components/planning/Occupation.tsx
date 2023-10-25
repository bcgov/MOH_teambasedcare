import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { SearchBar } from '../generic/SearchBar';
import { Paginator } from '../generic/Paginator';
import { OccupationSelector } from '../OccupationSelector';
import { Form, Formik } from 'formik';
import { usePlanningContent, usePlanningOccupations } from '@services';
import { SaveOccupationDTO } from '@tbcm/common';
import createValidator from 'class-validator-formik';
import { Error } from '../Error';
import { PageTitle } from '../PageTitle';
import { useState } from 'react';

export interface OccupationProps {
  step: number;
  title: string;
}

const OccupationForm = ({ searchValue = '' }) => {
  usePlanningContent();
  return (
    <Form className='flex-1 flex flex-col overflow-auto'>
      <OccupationSelector searchValue={searchValue} showDescriptionModal></OccupationSelector>
    </Form>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Occupation: React.FC<OccupationProps> = ({ title }) => {
  const occupationValidationSchema = createValidator(SaveOccupationDTO);
  const [searchValue, setSearchValue]: [string, (search: string) => void] = useState('');

  // proceed to next step after submission
  const { handleSubmit, initialValues } = usePlanningOccupations({ proceedToNextOnSubmit: true });

  // Get search value
  const handleSearch = (e: { target: { value: string } }) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className='planning-form-box'>
      <div className='flex-1 flex flex-col min-h-0'>
        <div className='flex-1 min-h-0 flex flex-col'>
          <PageTitle
            title={'Select Occupations/Roles'}
            description={'Select all the occupations/roles on your team'}
          >
            <FontAwesomeIcon className='text-bcBluePrimary inline w-6 h-6' icon={faUserCircle} />
          </PageTitle>

          <div>
            <SearchBar placeholderText='Search by keyword' handleChange={handleSearch}></SearchBar>
          </div>

          <Formik
            initialValues={initialValues}
            validate={occupationValidationSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            enableReinitialize={true}
          >
            {({ values }) => (
              <div className='flex-1 flex flex-col min-h-0 p-2'>
                <p className='text-sm font-extralight font-sans text-gray-400'>
                  {values.occupation?.length} occupations selected
                </p>
                <Paginator></Paginator>
                <Error name='occupation'></Error>
                <OccupationForm searchValue={searchValue}></OccupationForm>
                <Paginator></Paginator>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

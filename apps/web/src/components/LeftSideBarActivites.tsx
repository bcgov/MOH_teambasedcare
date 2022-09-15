import {  useState } from 'react';
import _ from 'lodash';
import data from "../common/careActivites.json";

export interface LeftSideBarActivitesProps {
    title: string;
}

export interface SearchInputProps {
    title: string;
}

export const LeftSideBarActivites: React.FC<LeftSideBarActivitesProps> = ({ title }) => {
    const [items] = useState(data);
    const [selectedItem, setSelectedItem] = useState();
    const [searchValue, setSearchValue]: [string, (search: string) => void] = useState("");

    // Get search value
    const handleSearch = (e: { target: { value: string; }; }) => {
        setSearchValue(e.target.value);
    };
    // Filter data with search value
    const filteredData = items.result && items.result.filter(item => {
        return item.name.toLowerCase().includes(searchValue.toLowerCase())
    });

    return (
        <div className='w-1/3 mt-4 border-2 border-gray-200 p-4'>
            <div className="justify-between w-full items-center mb-4 border-b-2 border-gray-200 pb-4">
                <h3 className="text-xl text-bcBluePrimary leading-none ">{title}</h3>
                <p className="text-sm text-gray-400">{items.count} Activities</p>
            </div>

            <input
                type="text"
                name="search"
                placeholder="Search "
                className="block w-full text-sm text-slate-500 border-2 border-gray-200 p-2"
                value={searchValue}
                onChange={handleSearch}
            />
           
            <div className="mt-4" style={{overflow: "auto", maxHeight: "400px"}}>
                <ul role="list">
                    { !_.isEmpty(filteredData) ?
                        filteredData.map((item, index) => {
                                return (
                                    <li key={item.id} className={`${selectedItem == item.id && "bg-gray-200"} cursor-pointer p-2 hover:bg-gray-200`} onClick={()=> {}}>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-bcBluePrimary truncate dark:text-white">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-gray-400 truncate dark:text-gray-400">
                                                   0 / {item.careActivities.length} selection
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        : <p className='text-center text-sm mt-4'>No available Care Activity Bundles.</p>
                    }
                </ul>
            </div>
        </div>
    );
};
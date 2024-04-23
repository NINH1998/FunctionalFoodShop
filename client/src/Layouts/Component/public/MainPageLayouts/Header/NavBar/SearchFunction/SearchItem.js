import { createSlug } from 'Ultils/helper';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const SearchItem = ({ el, setIsSearch, setSearchValue }) => {
    const handleSearchResult = () => {
        setSearchValue({ q: '' });
        setIsSearch(false);
    };
    return (
        <Link to={`/${createSlug(el?.category)}/${el?._id}/${createSlug(el?.title)}`} onClick={handleSearchResult}>
            <div className="flex justify-start items-center gap-2 px-2 py-1 text-black hover:bg-gray-200 cursor-pointer animation-200">
                <img alt="" src={el.thumb} className="w-10 h-10"></img>
                <h4 className="text-base line-clamp-2">{el.title}</h4>
            </div>
        </Link>
    );
};

export default memo(SearchItem);

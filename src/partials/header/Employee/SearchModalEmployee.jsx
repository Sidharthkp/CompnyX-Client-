import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase/Config';
import Transition from '../../../utils/Transition';

function SearchModal({
  id,
  searchId,
  modalOpen,
  setModalOpen
}) {

  const [search, setSearch] = useState("");
  const [slips, setSlips] = useState([]);
  const [email, setEmail] = useState("");

  const authentication = async () => {
    let email = localStorage.getItem("email")
    setEmail(email)
}

  const getUsers = async () => {
    let id
    await axios.post(`${import.meta.env.VITE_IP_ADD}/employee/getEmployeeDetails`, { email })
    .then((data)=>{
      id = data.data._id
    })
    const res = await axios.post(`${import.meta.env.VITE_IP_ADD}/employee/getSalarySlip`, {id});
    setSlips(res.data);
  }


  const searchData = (data) => {
    return search === ""
      ? data
      : data.timeStamps.includes(search)
  }

  const modalContent = useRef(null);
  const searchInput = useRef(null);

  // close on click outside
  useEffect(() => {
    authentication()
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return
      setModalOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    getUsers()
    modalOpen && searchInput.current.focus();
  }, [modalOpen, search]);

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center transform px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div ref={modalContent} className="bg-white overflow-auto max-w-2xl w-full max-h-full rounded shadow-lg">
          {/* Search form */}
          <form className="border-b border-slate-200">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">Search</label>
              <input id={searchId}
                onChange={(e) => {
                  let searchValue = e.target.value.toLocaleLowerCase();
                  setSearch(searchValue)
                }}
                className="w-full border-0 focus:ring-transparent placeholder-slate-400 appearance-none py-3 pl-10 pr-4" type="search" placeholder="Search Anything…" ref={searchInput} />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-4 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>
          <div className="py-4 px-2">
            {/* Recent pages */}
            <div className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">Salary Slips</div>
              <ul className="text-sm">
              {
                  slips.filter(searchData).map(slips => {
                    return (
                      <li key={slips._id}>
                        <Link
                          className="flex items-center p-2 text-slate-800 hover:text-white hover:bg-indigo-500 rounded group"
                          to={{
                            pathname: "/slipDetails",
                            search: `?q=${slips._id}`
                          }}
                          onClick={() => setModalOpen(!modalOpen)}
                        >
                          <span className='flex flex-row justify-around w-full'>
                            <div className=' flex flex-row justify-start w-full'>
                              <span className="font-medium text-slate-800 group-hover:text-white">Salary Slip of {slips?.timeStamps}</span>
                            </div>
                            <div className=' flex flex-row justify-center w-full'>
                              <span className="font-medium text-slate-800 group-hover:text-white">{slips?._id}</span>
                            </div>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default SearchModal;

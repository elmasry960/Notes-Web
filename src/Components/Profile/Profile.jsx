import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import "./profile.css";
import axios from "axios";
import $ from "jquery";
import Swal from 'sweetalert2'

export default function Profile() {
  const [updateDate, setUpdateData] = useState([]);
  const [notes, setNotes] = useState([]);
  const [clearValue, setClearValue] = useState([]);
  let [responseDecode, setResponseDecode] = useState({});
  let [inputData, setInputData] = useState({
    title: "",
    desc: "",
    userID: "",
    token: "",
  });

  // Decode Token UserID
  function decodeToken() {
    let responseDecode = jwtDecode(localStorage.getItem("tkn"));
    setResponseDecode(responseDecode);
  }

  // Get Note Data
  function getData(e) {
    let inputValue = e.target.value;
    let newData = { ...inputData };
    newData[e.target.id] = inputValue;
    newData.userID = responseDecode._id;
    newData.token = localStorage.getItem("tkn");
    setInputData(newData);
  }

  // Clear Input Add
  function clearData() {
    let clearValue = {
      title: (document.getElementById("title").value = ""),
      desc: (document.getElementById("desc").value = ""),
    };
    setClearValue(clearValue);
  }

  // Push Note Api
  async function addNoteApi() {

    let { data } = await axios.post(
      "https://route-egypt-api.herokuapp.com/addNote",
      inputData
    );
    clearData();
    getNoteApi();
    $(".modal , .modal-backdrop").fadeOut(500);

    

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Add in successfully'
    })
  }

  // Get All Notes
  async function getNoteApi() {
    let token = localStorage.getItem("tkn");
    let decoded = jwtDecode(token);
    let { data } = await axios.get(
      "https://route-egypt-api.herokuapp.com/getUserNotes",
      {
        headers: {
          token,
          userID: decoded._id,
        },
      }
    );
    setNotes(data.Notes);


  }

  // Delet Note
  function deletNote(idNote) {

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let token = localStorage.getItem("tkn");
         axios.delete(
          "https://route-egypt-api.herokuapp.com/deleteNote",
          {
            data: {
              NoteID: idNote,
              token,
            },
          }
        ).then((response)=> {
          if (response.data.message == "deleted") {
            console.log(response)
            getNoteApi();
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        } )
        
      }
    })
    
  }

  // Get old Data Input
  function updateNote(e) {
    setUpdateData(e);

    document.getElementById("title").value = e.title;
    document.getElementById("desc").value = e.desc;
    
    $(".fa-file-pen").click(() => {
      $(".layer").fadeIn();
      $(".modal-footer .update").show(100);
      $(".modal-footer .add").hide(100);
    });
    setInputData({
      ...inputData,
      title: document.getElementById("title").value,
      desc: document.getElementById("desc").value,
    });

      
  }



  // Set New Upudate
  async function addUpdateNote() {
    let updateValue = {
      title: (document.getElementById("title").value = inputData.title),
      desc: document.getElementById("desc").value = inputData.desc,
      NoteID: updateDate._id,
      token: localStorage.getItem("tkn"),
    };

    let { data } = await axios.put(
      "https://route-egypt-api.herokuapp.com/updateNote",
      updateValue
    );
    document.getElementById("title").value = inputData.title;
    document.getElementById("desc").value = inputData.desc
    

    $(".layer").hide(500);
    getNoteApi();

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'Update in successfully'
    })
  }

  // Open Layer Add Data
  function show() {
    $(".close , .add ").click(() => {
      $(".layer").fadeOut(500);
    });

    $(".btn-close").click(() => {
      $(".layer").hide(500);
    });

    $(".addNote").click(() => {
      document.getElementById("title").value = '';
    document.getElementById("desc").value = ''
      $(".layer").fadeIn(500);
      $(".modal-footer .update").hide(100);
      $(".modal-footer .add").show(100);
    });
  }

  useEffect(() => {
    decodeToken();
    getNoteApi();
    show();
  }, []);

  return (
    <>
      <div className="container py-5">
        <div>
          <button
            type="button"
            className="btn btn-info float-end mb-4 addNote"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Note
          </button>
        </div>

        <div className="row gy-5 mt-5">
          {notes?.map((note, key) => (
            <div key={key} className="col-md-3">
              <div className="item position-relative">
                <div className="icons position-absolute top-0 end-0 me-3 mt-3">
                  <span onClick={() => updateNote(note)}>
                    <i className="fa-solid fa-file-pen"></i>
                  </span>
                  <span onClick={() => deletNote(note._id)}>
                    <i className="fa-regular fa-trash-can"></i>
                  </span>
                </div>
                <h4>{note.title}</h4>
                <p>{note.desc} </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="layer position-fixed top-0 end-0 bottom-0 start-0">
        <div className="position-fixed top-0 end-0 bottom-0 start-0 d-flex justify-content-center align-items-center">
          <div className="modal-content bg-white p-4">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                onChange={getData}
                id="title"
                type="text"
                placeholder="Title"
                className="form-control"
              />
              <textarea
                onChange={getData}
                id="desc"
                type="text"
                cols="30"
                rows="10"
                placeholder="Title"
                className="form-control mt-4"
              />
            </div>
            <div className="modal-footer mt-3">
              <button
                onClick={addUpdateNote}
                type="button"
                className="btn btn-info update text-white mx-2"
              >
                Update
              </button>
              <button
                onClick={addNoteApi}
                type="button"
                className="btn btn-info add text-white mx-2"
              >
                Add
              </button>
              <button
                onClick={show}
                type="button"
                className="btn btn-danger close"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

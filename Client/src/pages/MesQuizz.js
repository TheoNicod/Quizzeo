import './MesQuizz.css';
import { FaPlay, FaEdit, FaTrashAlt,FaLink } from 'react-icons/fa';
import {IoIosStats} from 'react-icons/io'
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BsFillFileEarmarkArrowUpFill } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';
import  { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import ModalSessionParameter from '../component/Modal/ModalSessionParameter';
import '../component/Loader/Loader.css'
import { toast } from 'react-toastify';

const MesQuizz = () => {

    //Initialisation des états
    const [datas, setDatas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loader,setLoader] = useState(false);
    const [currId,setCurrId] =useState('');

    ///Utilisation du hook pour gérer les requêtes Axios
    const axiosPrivate=useAxiosPrivate()

    //Initialisation la fonction de navigation
    const navigate = useNavigate();

    //Chargement des données du quiz lors du montage du composant*
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
            const response = await axiosPrivate.get('/quizz');
            if(response) {
                setDatas(response.data);
                setLoader(true)
            }
            } catch (err) {
                console.log(err.response.status);
                //Si l'id n'existe pas redirection vers la page Error 404
                if(err.response.status === 404){
                navigate('./missing');
                }
            }
        }
        fetchQuiz();
    }, [navigate,axiosPrivate]);

    // Géstion de la mise à jour de la barre de recherche
    const handleSearchTerm = (e) => {
        let value = e.target.value;
        setSearchTerm(value);
    }

    // Gestion de la création de quizz
    const [createQuizz, setCreateQuizz] = useState(false);

    const handleCreateQuizz = () => {
        setCreateQuizz(!createQuizz);
    }


    // Gestion de la suppression de quizz
    const handleDeleteQuiz = (quizz_id) => {
        const fetchDeleteQuiz = async () => {
            try{
                 // Requête POST pour éditer les données dans la BD
                const response = await axiosPrivate.delete(`/quizz`,{data: {id: quizz_id}});
                if(response.status === 200) {
                    console.log(response.data)
                    const listDatas = datas.filter((item) => item._id !== quizz_id);
                    setDatas(listDatas);

                    // Notification de suppression réussie
                    toast.success('Suppression réussie');
                }
            } catch (err){
                // Notification de suppression échouée
                toast.error('La suppression du quiz a échouée');

                // Erreur affichée dans la console
                console.log(err.response.data.message)
            }
        }
        fetchDeleteQuiz();
    }

    
    //Gestion du modal
    const[modal,setModal]= useState(false);
    const toggleModal = (id) =>{
        setCurrId(id)
        //Inverse le bollean de modal
        setModal(!modal);
    }


    return (
        <>
        
            {loader===true?(<div className='content_main'>
                {datas.length ? (
                <>
                    <div className='add_quizz'>
                        <button onClick={handleCreateQuizz}>CRÉER UN QUIZ</button>
                        <input 
                            type='text' 
                            placeholder='Rechercher...' 
                            name='searchBar'
                            onChange={handleSearchTerm}
                        />
                    </div>
                    
                    
                        
                    
                    <div className='quizz_display'>
                        <ul>
                            {datas
                                .filter((val) => {
                                return val.name.includes(searchTerm);
                                })
                                .map((val,index) => {
                                return (
                                    <li className='quizz' key={index}>
                                        <p className='quizz_name'>{val.name}</p>
                                        <button className='play_button' title='Démarrer' onClick={()=>toggleModal(val._id)}> <FaPlay className='FaPlay' alt='play button' /> </button>
                                        <button className='edit_button' title='Modifier' onClick={()=>{ navigate(`/mesquizz/modifier/${val._id}`)}}> <FaEdit className='FaEdit' alt='edit button'/> </button>
                                        <button className='stats_button' title='Statistiques' onClick={()=>{ navigate(`/mesquizz/stat/${val._id}`)}}> <IoIosStats className='FaStats' alt='statistical button' /> </button>
                                        <button className='link_button' title='Attacher' onClick={()=>{navigate(`/mesquizz/quizz/${val._id}`)}}> <FaLink className='FaLink' alt='attach button' /> </button>
                                        <button className='del_button' title='Supprimer' onClick={()=>{ handleDeleteQuiz(val._id)}}> <FaTrashAlt className='FaTrash' alt='delete button' /> </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <button className='add_button_bis' onClick={handleCreateQuizz}>CRÉER UN QUIZ</button>
                </>
                
            ) : (
                
                <div className='content_main'>
                    <p className='empty_quizz'>VOUS N'AVEZ PAS ENCORE DE QUIZ</p>
                    <button  className='add_button_quizz' onClick={handleCreateQuizz}>CRÉER UN QUIZ</button>
                </div>
                
                
            )}
            {createQuizz ? 
            <div className='creation'>
                
                <ImCross className='cross_creation_quizz' role='button' onClick={handleCreateQuizz}/>
                <h2>Créer un Quiz</h2>
                <p>Créez ou importez un quiz</p>
                <div className='creation_quizz'>
                    
                    <section>
                    <button><AiOutlineFileAdd className='icons' onClick={()=>{navigate("/mesquizz/creer")}}/></button>
                    <h3>Nouveau Quiz</h3>
                    <p>Vous souhaitez partir de zéro</p>
                    </section>
                    <section>
                    <button><BsFillFileEarmarkArrowUpFill className='icons'/></button>
                    <h3>Importer un Quiz</h3>
                    <p>Reprendre un quiz existant</p>
                    </section>
                </div>
            </div>
            : ""
            }
            
            
            <ModalSessionParameter
                modal={modal} 
                toggleModal={toggleModal}
                quizz_id={currId}    
            />

            </div>):(
                <div  className="dot-flashing"></div>
            )
        }
        </>
            
    )
}

export default MesQuizz

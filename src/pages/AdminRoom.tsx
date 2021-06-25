import { useHistory, useParams  } from "react-router-dom";
import logo from "../assets/images/logo.svg"
import deletImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import '../assets/styles/room.scss';

import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { Button } from "../components/Button";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";
import React from "react";


type RoomParam = {
  id: string;
}

export function AdminRoom () {
  const history = useHistory();
  const params = useParams<RoomParam>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  async function handleCheckQuestionAsAnswered (questionId : string) {
    if(window.confirm('Tem certeza que você deseja marcar esta pergunta como respondida ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    }
  }

  async function handleHighlightQuestion (questionId : string) {
    if(window.confirm('Tem certeza que você deseja dar destaque a esta pergunta ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });
    }
  }

  async function handleDeleteQuestion (questionId : string) {
    if(window.confirm('Tem certeza que você deseja excluir esta pergunta ?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom () {
    if(window.confirm('Tem certeza que você deseja excluir esta sala ?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });
      history.push('/');
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Letemeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button onClick={() => handleEndRoom()} isOutlined>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          { questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isHighlighted={question.isHighlighted}
                isAnswered={question.isAnswered}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar a pergunta como respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}
               
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deletImg} alt="deletandoImg" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}


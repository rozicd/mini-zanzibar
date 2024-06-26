import { React, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InfoDialog from "./DialogComponent";
import NoteInfoComponent from "./NoteInfoComponent";

const NoteCardComponent = ({ note }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState(null);

  const handleNoteClick = (event) => {
   
    console.log("Share icon clicked");
    setContent(<NoteInfoComponent note = {note}/>);
    setDialogOpen(true);
  };

  const handleCloseDialog = (c) => {
    setDialogOpen(false);
    if (c) {
      setContent(c);
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Card
        key={note.id}
        style={{
          margin: "10px",
          width: "200px",
          height: "300px",
          backgroundColor: "#333",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CardContent
          sx={{ cursor: "pointer" }}
          onClick={() => handleNoteClick(true)
            
          }
        >
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {note.name}
          </h3>
            
        </CardContent>
      </Card>
      <InfoDialog
        open={dialogOpen}
        onClose={() => handleCloseDialog()}
        content={content}
      ></InfoDialog>
    </>
  );
};

export default NoteCardComponent;
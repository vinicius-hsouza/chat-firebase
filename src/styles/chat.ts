import styled, { css } from "styled-components";

export const Container = styled.div`
  background: #202025;
  display:flex ;
  flex: 1;

  align-items: center ;
  justify-content: center ;
`;

export const Content = styled.div`
  background: #121214;
  height: 640px;
  width: 480px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  
`;

export const Header = styled.div`
  padding: 8px 0;
  background: #323436;

  display: flex;
  align-items: center;
  padding: 8px 16px;



  >img{
    height:40px;
    width: 40px;
    border-radius: 50%;
  }

  > div{
    flex: 1;
    margin-left: 8px;

    >p:nth-of-type(1){
      font-weight: bold;
      color: #fff;
    }

    > p{
      font-size: 14px;
      font-weight:500;
      color: #aeb4b0;
    }
  }

  > span{
    > div{
      cursor: pointer;
      >svg {
        height: 20px ;
        width: 20px ;
      }
    }
  }
`;
export const MessagesContent = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  overflow: auto;
`;

interface MessageItemProps {
  isUserLogged?: boolean;
}

export const MessageItem = styled.div<MessageItemProps>`
    background: #217bc3;
    margin: 8px 16px;
    padding: 4px;
    border-radius: 4px;
    
    
    display: flex;
    
    >img{
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }

    >div{
      margin-left: 8px;

      >p:nth-of-type(1){
        font-weight: bold;
        color: #aeb4b0;
      }
      
      > p{
        font-size: 14px;
        font-weight:500;
        color: #fff;
        text-align: left;
      } 
      
      >span{
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-top: 4px;

      >p{
        font-size: 10px;
      }
    }
    }

   

    ${props => props.isUserLogged && css`
      background: #737373;
      align-self: flex-end;

      >div {
        margin-left: 0;
      }
    `}
`;

export const EditorContent = styled.div`
  display: flex;
  padding: 8px 16px;
  background: #323436;

  > form{
    display: flex;
    flex :1;

    >input, button{
      border: none;
      height: 32px;
    }

    > input {
      width: 100%;
      background: #737373;
      border-radius: 8px;
      padding: 8px;
      color: #fff;

      &::placeholder{
        color: #aeb4b0;
      }
    }

    > div { 
      background: #237bc3;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      margin-left: 8px;

      height: 32px;
      width: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      >svg {
        height: 20px ;
        width: 20px ;
      }
    }
    
  }
`;
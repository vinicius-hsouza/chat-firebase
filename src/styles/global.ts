import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
*{
    margin: 0;
    padding:0;
    box-sizing: border-box;
    outline: 0;

  }

  html, body, #root{
    height: 100%;
    overflow: auto;
  }

  #root{
    display: flex;
  }

  body{
    background: #121214;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }



  body, input, button{
    font-family: 'Inter', sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button{
    cursor: pointer;
  }
`;
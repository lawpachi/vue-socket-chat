/**
 * Created by shenlu on 17/4/14.
 */
export  function getUserId () {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( let i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return new Date().getTime()+text;
};

export  function getNowTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDay();
  let hours = date.getHours();
  let min = date.getMinutes();
  return year + '-' + month + '-' + day + ' ' + hours +':'+ min;
}

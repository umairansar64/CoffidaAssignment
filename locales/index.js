import I18n from 'ex-react-native-i18n';
import * as Localization from 'expo-localization';

import en from './en.json';
import fr from './fr.json';

I18n.translations = {
  fr,
  en
}

I18n.defaultLocale = 'en'
I18n.locale = 'en';

export function getLanguage(){
  try{
    const choice = Localization.locale;
    console.log("Choices: ", choice, choice.substr(0, 2));
    I18n.locale = choice.substr(0, 2);
  }catch(err){
    console.log("Error: ", err);
  }
}

export function t(name){
  return I18n.t(name);
}

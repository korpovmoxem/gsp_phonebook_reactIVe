// Определяем структуру темы
export type AppTheme = {
    background: string;
    backgroundBlock: string
    mainTextColor: string
    toggleColor: string
    backgroundSearh: string
    hoverItemText: string
    backgroundSubHeader: string
    borderColor: string
    subHeaderColor: string
    backgroundRowHover: string
    greyHeader: string
    shadowColor: string
    BackgroundDatalist: string
    backgroundModalEditInput: string
    modalBlurColor: string
    backgroundSearchItem: string
}

const WHITE = '#ffffff'
const BLACK = '#000000'
const dark_grey_1 = '#333333'

export const lightTheme: AppTheme = {
    background: '#f7f7f7',
    backgroundBlock: WHITE,
    mainTextColor: BLACK,
    toggleColor: '#999999',
    backgroundSearh: WHITE,
    hoverItemText: "#00000070",
    backgroundSubHeader: "#f1f1f1",
    borderColor: WHITE,
    subHeaderColor: BLACK,
    backgroundRowHover: '#f8f8ff',
    greyHeader: '#666666',
    shadowColor: 'rgba(34, 60, 80, 0.75)',
    BackgroundDatalist: WHITE,
    backgroundModalEditInput: 'rgba(240, 240, 240, 0.5)',
    modalBlurColor: 'rgba(0, 0, 0, 0.25)',
    backgroundSearchItem: '#c5def078',
};

export const darkTheme: AppTheme = {
    background: '#252525',
    backgroundBlock: '#333333',
    mainTextColor: WHITE,
    toggleColor: WHITE,
    backgroundSearh: dark_grey_1,
    hoverItemText: "#ffffff9c",
    backgroundSubHeader: "#404040",
    borderColor: '#9b9b9b',
    subHeaderColor: "#ffffff9c",
    backgroundRowHover: '#272727',
    greyHeader: '#959595',
    shadowColor: 'rgba(175, 198, 216, 0.75)',
    BackgroundDatalist: '#252525',
    backgroundModalEditInput: 'rgba(29, 29, 29, 0.5)',
    modalBlurColor: 'rgba(255, 255, 255, 0.25)',
    backgroundSearchItem: '#56565678',
};
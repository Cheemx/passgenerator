import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity, 
    TextInput
} from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox'

// Form Validation 
import * as Yup from 'yup'
import { Formik } from 'formik'

const PasswordSchema = Yup.object().shape({
    passwordLength: Yup.number().required("Length is required!").min(4, "Should be minimum of 4 chars").max(16, "Should be maximum of 16 characters.")
})

export default function App() {
    const [pass, setPass] = useState('')
    const [isPassGenerated, setIsPassGenerated] = useState(false)

    const [lowercase, setLowerCase] = useState(true)
    const [upperCase, setUpperCase] = useState(false)
    const [numbers, setNumbers] = useState(false)
    const [symbols, setSymbols] = useState(false)

    const generatePasswordString = (passwordLength: number) => {
        let characterList = ''

        const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'
        const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
        const digitChars = '0123456789'
        const specialChars = '!@#$%^&*()_+'

        if (upperCase) {
            characterList += upperCaseChars
        }

        if (lowercase) {
            characterList += lowerCaseChars
        }

        if (numbers) {
            characterList += digitChars
        }

        if (symbols) {
            characterList += specialChars
        }

        const PasswordResult = createPassword(characterList, passwordLength)

        setPass(PasswordResult)
        setIsPassGenerated(true)
    }

    const createPassword = (characters: string, passwordLength: number) => {
        let result = ''
        for(let i = 0;i < passwordLength; i++) {
            const charIndex = Math.round(Math.random() * characters.length)
            result += characters.charAt(charIndex)
        }
        return result
    }

    const resetPassword = () => {
        setPass('')
        setIsPassGenerated(false)
        setLowerCase(true)
        setUpperCase(false)
        setNumbers(false)
        setSymbols(false)
    }
    
    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <SafeAreaView style={styles.appContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Password Generator</Text>
                    <Formik
                        initialValues={{passwordLength : ''}}
                        validationSchema={PasswordSchema}
                        onSubmit={ values => {
                            console.log(values);                            
                            generatePasswordString(+values.passwordLength)
                        }}
                    >
                    {({
                        values,
                        errors,
                        touched,
                        isValid,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        /* and other goodies */
                    }) => (
                        <>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputColumn}>
                                    <Text style={styles.heading}>
                                        Password Length
                                    </Text>
                                    {touched.passwordLength &&errors.passwordLength && (
                                        <Text style={styles.errorText}>
                                            {errors.passwordLength}
                                        </Text>
                                    )}
                                </View>
                                <TextInput
                                    style={styles.inputStyle}
                                    value={values.passwordLength}
                                    onChangeText={handleChange('passwordLength')}
                                    placeholder='Ex. 8'
                                    keyboardType='numeric'
                                />
                            </View>

                            <View style={styles.inputWrapper}>
                                <Text style={styles.heading}>Include Lowercase</Text>
                                <BouncyCheckbox
                                    disableText
                                    useBuiltInState={false}
                                    isChecked={lowercase}
                                    onPress={() => setLowerCase(!lowercase)}
                                    fillColor='#29AB87'
                                />
                            </View>
                            
                            <View style={styles.inputWrapper}>
                                <Text style={styles.heading}>
                                    Include Uppercase letters
                                </Text>
                                <BouncyCheckbox
                                    disableText
                                    isChecked={upperCase}
                                    onPress={() => setUpperCase(!upperCase)}
                                    fillColor='#FED85D'
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.heading}>
                                    Include Numbers
                                </Text>
                                <BouncyCheckbox
                                    disableText
                                    isChecked={numbers}
                                    onPress={() => setNumbers(!numbers)}
                                    fillColor='#C9A0DC'
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.heading}>
                                    Include Symbols
                                </Text>
                                <BouncyCheckbox
                                    disableText
                                    isChecked={symbols}
                                    onPress={() => setSymbols(!symbols)}
                                    fillColor='#FC80A5'
                                />
                            </View>

                            <View style={styles.formActions}>
                                <TouchableOpacity
                                    disabled={!isValid}
                                    style={styles.primaryBtn}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.primaryBtnText}>
                                        Generate Password
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.secondaryBtn}
                                    onPress={() => {
                                        handleReset()
                                        resetPassword()
                                    }}
                                >
                                    <Text style={styles.secondaryBtnText}>
                                        Reset
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                    </Formik>
                </View>
                {isPassGenerated ? (
                    <View style={[styles.card, styles.cardElevated]}>
                        <Text style={styles.subTitle}>Result:</Text>
                        <Text style={styles.description}>Long Press to copy</Text>
                        <Text selectable={true} style={styles.generatedPassword}>{pass}</Text>
                    </View>
                ) : null}
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
    },
    formContainer: {
        margin: 8,
        padding: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 15,
    },
    subTitle: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 15,
    },
    description: {
        color: "#758283",
        marginBottom: 8,
    },
    heading: {
        fontSize: 15
    },
    inputWrapper: {
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    inputColumn: {
        flexDirection: 'column',
    },
    inputStyle: {
        padding: 8,
        width:'30%',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: "#16213e",
    },
    errorText: {
        fontSize: 12,
        color: '#ff0d10',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    primaryBtn: {
        width: 120,
        padding: 0,
        borderRadius: 8,
        marginHorizontal: 8,
        backgroundColor: '#5DA3FA',
    },
    primaryBtnText: {
        color: "#fff",
        textAlign: 'center',
        fontWeight: '700',
    },
    secondaryBtn: {
        width: 120,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 8,
        backgroundColor: '#CAD5E2',
    },
    secondaryBtnText: {
        textAlign: 'center',
    },
    card: {
        padding: 12,
        borderRadius: 6,
        marginHorizontal: 12,
    },
    cardElevated: {
        backgroundColor: "#ffffff",
        elevation: 1,
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowColor:'#333',
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    generatedPassword: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 12,
        color: '#000',
    },
})
import useGlobalStore from '@/store/globalStore'
import { TOGGLES } from '@/store/uiSlice'
import { motion } from 'framer-motion'
import React from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function MatchRunToggle() {
    const { speccID, wizardState, setToggle } = useGlobalStore(s => ({
        speccID: s.speccId,
        wizardState: s.UI.TOGGLES.WIZARD_MODE,
        setToggle: s.UI.setToggle
    }))
    const navigate = useNavigate()
    const navigateToMatchWizard = useMemo(() => () => {
        navigate(`/specc/${speccID}/matching/build-match`)
    }, [speccID, navigate])

    const navigateToRunWizard = useMemo(() => () => {
        navigate(`/specc/${speccID}/transformation`)
    }, [speccID, navigate])

    const toggle = () => {
        if (wizardState === TOGGLES.WIZARD_MODE.MATCH) {
            setToggle(TOGGLES.WIZARD_MODE.RUN)
            navigateToRunWizard()
        } else if (wizardState === TOGGLES.WIZARD_MODE.RUN) {
            setToggle(TOGGLES.WIZARD_MODE.MATCH)
            navigateToMatchWizard()
        }
    }

    return (
        <button type='button' onClick={toggle} className={`h-[26px] w-[48px] p-[2px] rounded bg-custom-blackPearl flex ${wizardState === TOGGLES.WIZARD_MODE.RUN ? "justify-start" : "justify-end"}`}>
            <motion.div layout className='h-[22px] w-[22px] p-[4px] bg-grey-15 rounded' />
        </button>
    )
}

export default MatchRunToggle
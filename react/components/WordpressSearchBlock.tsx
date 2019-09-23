import React, { useState } from 'react'
import { InputSearch } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { defineMessages } from 'react-intl'
import styles from './search.css'

const WordpressSearchBlock: StorefrontFunctionComponent<WordpressSearchProps> = ({ placeholder }) => {
	const [ inputValue, setValue ] = useState('')

	const { navigate } = useRuntime()

	const onGoToWordpressSearchPage = (e: any) => {
		e.preventDefault()
		if (inputValue != '') {
			const search = inputValue;
			setValue('')
			navigate({
				page: 'store.blog-search-result',
				params: { terms: search }
			})
		}
	};

	return (
		<div className={`${styles.searchBlockContainer} relative-m w-100`}>
			<form
				className="mb5"
				onSubmit={(e) => {
					onGoToWordpressSearchPage(e)
				}}
			>
				<InputSearch
					placeholder={placeholder}
					size="large"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setValue(event.target.value)
					}}
					onSubmit={(e: React.ChangeEvent<HTMLInputElement>) => {
						onGoToWordpressSearchPage(e)
					}}
				/>
			</form>
		</div>
	);
};

interface WordpressSearchProps {
	/** Placeholder to be used on the input */
	placeholder: string
}

const messages = defineMessages({
    title: {
      defaultMessage: '',
      id: 'admin/editor.wordpressSearch.title',
    },
    description: {
      defaultMessage: '',
      id: 'admin/editor.wordpressSearch.description',
	},
	placeholderTitle: {
		defaultMessage: '',
		id: 'admin/editor.wordpressSearchPlaceholder.title'
	}
})

WordpressSearchBlock.schema = {
    title: messages.title.id,
    description: messages.description.id,
    type: 'object',
    properties: {
        placeholder: {
            title: messages.placeholderTitle.id,
            type: 'string',
            isLayout: false,
            default: 'Search articles...'
        },
    }
};
WordpressSearchBlock.defaultProps = {
    placeholder: 'Search articles...'
};

export default WordpressSearchBlock
import styled, { css } from 'styled-components';

export const CheckContainer = styled.div<{
	$active: boolean;
	$enabled: boolean;
}>`
	border-radius: 6px;
	max-width: 400px;
	padding: 12px 30px;
	p {
		margin-bottom: 12px;
		color: ${props => (!props.$enabled ? '#c6c6c6' : 'inherit')};
	}
	align-items: flex-start;
	${props =>
		props.$active &&
		css`
			color: ${({ theme }) => theme.primary} !important;
			background: ${({ theme }) => theme.highlight};
			&:hover {
				background: ${({ theme }) => theme.highlight};
			}
		`};
`;

export const FormFooter = styled.div`
	padding: 10px 0;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
`;

export const ErrorMessage = styled.div`
	color: ${({ theme }) => theme.semantic.danger};
`;

export const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	min-height: 400px;
	padding: 10px 20px;
`;

export const ChecksSubmitSuccess = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	flex-direction: column;
	justify-content: center;
	z-index: 10;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	p {
		color: ${({ theme }) => theme.semantic.success};
		font-size: 16px;
	}
`;

export const PlaceholderContainer = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

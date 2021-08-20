export class SocialNetworksModel {
    linkedIn: string;
    facebook: string;
    twitter: string;
    instagram: string;
    setSocialNetworks(socialNetwork: any) {
        this.linkedIn = socialNetwork.linkedIn;
        this.facebook = socialNetwork.facebook;
        this.twitter = socialNetwork.twitter;
        this.instagram = socialNetwork.instagram;
    }
}
